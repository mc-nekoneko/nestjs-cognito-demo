import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from './auth/decorator/current-user.decorator';
import { CognitoAuthGuard } from './auth/guard/cognito.guard';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('/user')
  @UseGuards(CognitoAuthGuard)
  async getUser(@CurrentUser() user: User): Promise<string> {
    return JSON.stringify(user);
  }
}
