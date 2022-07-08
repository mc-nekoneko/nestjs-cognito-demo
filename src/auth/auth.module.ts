import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { CognitoStrategy } from './strategy/cognito.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'cognito' }),
    UserModule,
    ConfigModule,
  ],
  providers: [CognitoStrategy],
})
export class AuthModule {}
