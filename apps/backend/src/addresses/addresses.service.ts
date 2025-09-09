import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  listByUser(userId: string) {
    return this.prisma.address.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const a = await this.prisma.address.findUnique({ where: { id } });
    if (!a) throw new NotFoundException('Address not found');
    return a;
  }

  create(dto: CreateAddressDto) {
    return this.prisma.address.create({ data: dto });
  }

  async update(id: string, dto: UpdateAddressDto) {
    try {
      return await this.prisma.address.update({ where: { id }, data: dto });
    } catch {
      throw new NotFoundException('Address not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.address.delete({ where: { id } });
      return { ok: true };
    } catch {
      throw new NotFoundException('Address not found');
    }
  }
}