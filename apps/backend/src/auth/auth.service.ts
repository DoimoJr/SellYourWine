import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  /**
   * Registra un nuovo utente con email e password
   */
  async register(dto: RegisterDto) {
    // Verifica se l'utente esiste già
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Crea l'utente
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role ?? 'buyer'
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // Genera JWT
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user,
      ...tokens
    };
  }

  /**
   * Login con email e password
   */
  async login(dto: LoginDto) {
    // Trova l'utente
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verifica password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Genera JWT
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      ...tokens
    };
  }

  /**
   * Genera access token e refresh token
   */
  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    
    // Genera access token (15 minuti)
    const accessToken = await this.jwt.signAsync(payload, { expiresIn: '15m' });
    
    // Genera refresh token (30 giorni)
    const refreshToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 giorni
    
    // Salva refresh token nel database
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt
      }
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900 // 15 minuti in secondi
    };
  }

  /**
   * Refresh access token usando refresh token
   */
  async refreshTokens(dto: RefreshTokenDto) {
    // Trova il refresh token nel database
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refresh_token },
      include: { user: true }
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Verifica se il token è scaduto o revocato
    if (refreshToken.expiresAt < new Date() || refreshToken.isRevoked) {
      // Rimuovi token scaduto/revocato
      await this.prisma.refreshToken.delete({
        where: { id: refreshToken.id }
      });
      throw new UnauthorizedException('Refresh token expired or revoked');
    }

    // Revoca il vecchio refresh token per sicurezza
    await this.prisma.refreshToken.update({
      where: { id: refreshToken.id },
      data: { isRevoked: true }
    });

    // Genera nuovi token
    const tokens = await this.generateTokens(
      refreshToken.user.id, 
      refreshToken.user.email, 
      refreshToken.user.role
    );

    return {
      user: {
        id: refreshToken.user.id,
        email: refreshToken.user.email,
        role: refreshToken.user.role,
        createdAt: refreshToken.user.createdAt
      },
      ...tokens
    };
  }

  /**
   * Revoca tutti i refresh token di un utente (per logout)
   */
  async revokeUserTokens(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true }
    });
  }

  /**
   * Invia richiesta di reset password
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    // Trova l'utente
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (!user) {
      // Per sicurezza, non rivelare se l'email esiste o meno
      return { message: 'Se l\'email esiste, riceverai le istruzioni per il reset' };
    }

    // Revoca eventuali token precedenti
    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, isUsed: false },
      data: { isUsed: true }
    });

    // Genera token di reset (6 ore di validità)
    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 6);

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt
      }
    });

    // TODO: Inviare email con il token (per ora logghiamo)
    console.log(`🔑 Password reset token per ${user.email}: ${resetToken}`);
    console.log(`🔗 Link: http://localhost:3000/reset-password?token=${resetToken}`);

    return { message: 'Se l\'email esiste, riceverai le istruzioni per il reset' };
  }

  /**
   * Reset password usando token
   */
  async resetPassword(dto: ResetPasswordDto) {
    // Trova il token
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
      include: { user: true }
    });

    if (!resetToken) {
      throw new BadRequestException('Token non valido');
    }

    // Verifica se il token è scaduto o già utilizzato
    if (resetToken.expiresAt < new Date() || resetToken.isUsed) {
      throw new BadRequestException('Token scaduto o già utilizzato');
    }

    // Hash della nuova password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);

    // Aggiorna password e marca token come utilizzato
    await Promise.all([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword }
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { isUsed: true }
      }),
      // Revoca tutti i refresh token per sicurezza
      this.prisma.refreshToken.updateMany({
        where: { userId: resetToken.userId },
        data: { isRevoked: true }
      })
    ]);

    return { message: 'Password aggiornata con successo' };
  }

  /** DEMO login: crea o prende l'utente per email e rilascia un JWT */
  async loginDemo(email: string, role?: 'buyer'|'seller'|'admin') {
    if (!email) throw new UnauthorizedException('email required');

    const user = await this.prisma.user.upsert({
      where: { email },
      update: role ? { role } : {},
      create: { email, role: role ?? 'buyer' },
    });

    const payload = { sub: user.id, role: user.role, email: user.email };
    const token = await this.jwt.signAsync(payload);

    return { access_token: token, user };
  }
}