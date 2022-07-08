import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { UserService } from '../../user/service/user.service';
import { ConfigService } from '@nestjs/config';

export const cognitoJwksUri = (region: string, userPool: string) => {
  return `https://cognito-idp.${region}.amazonaws.com/${userPool}/.well-known/jwks.json`;
};

@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy, 'cognito') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: cognitoJwksUri(
          configService.get('AWS_REGION') as string,
          configService.get('AWS_COGNITO_USER_POOL') as string,
        ),
      }),
    });
  }

  async validate(payload: Record<string, any>) {
    const cognitoId = payload?.sub;
    const email = payload?.email;

    if (!email || !cognitoId) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findUser(email);
    if (user) return user;

    return await this.usersService.createUser({ email, cognitoId });
  }
}
