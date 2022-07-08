import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: { email: string; cognitoId: string }) {
    return this.prisma.user.create({
      data: {
        ...data,
      },
    });
  }

  async findUser(email: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
  }
}
