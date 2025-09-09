import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

class LoginDemoDto {
  email: string;
  /** opzionale per testare ruoli in dev: 'buyer' | 'seller' | 'admin' */
  role?: 'buyer'|'seller'|'admin';
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @ApiOperation({ summary: 'Registra un nuovo utente' })
  @ApiResponse({ status: 201, description: 'Utente registrato con successo' })
  @ApiResponse({ status: 409, description: 'Email già esistente' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @ApiOperation({ summary: 'Login con email e password' })
  @ApiResponse({ status: 200, description: 'Login effettuato con successo' })
  @ApiResponse({ status: 401, description: 'Credenziali non valide' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @ApiOperation({ summary: 'Refresh access token usando refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed con successo' })
  @ApiResponse({ status: 401, description: 'Refresh token non valido o scaduto' })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.auth.refreshTokens(dto);
  }

  @ApiOperation({ summary: 'Logout - revoca tutti i refresh token dell\'utente' })
  @ApiResponse({ status: 200, description: 'Logout effettuato con successo' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Request() req: any) {
    await this.auth.revokeUserTokens(req.user.userId);
    return { message: 'Logout successful' };
  }

  @ApiOperation({ summary: 'Richiedi reset password - invia token via email' })
  @ApiResponse({ status: 200, description: 'Richiesta inviata (se email esiste)' })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto);
  }

  @ApiOperation({ summary: 'Reset password usando token ricevuto via email' })
  @ApiResponse({ status: 200, description: 'Password resettata con successo' })
  @ApiResponse({ status: 400, description: 'Token non valido o scaduto' })
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto);
  }

  @ApiOperation({ summary: 'DEMO login: genera un JWT dato email (senza password)' })
  @Post('login-demo')
  loginDemo(@Body() dto: LoginDemoDto) {
    return this.auth.loginDemo(dto.email, dto.role);
  }
}