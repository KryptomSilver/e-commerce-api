import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  private getJsonWebTokenConfig() {
    const JWT_SECRET = this.configService.get('JWT_SECRET');
    const JWT_EXPIRATION = this.configService.get('JWT_EXPIRATION');
    return {
      JWT_SECRET,
      JWT_EXPIRATION,
    };
  }
  async generateAccessToken(payload: object): Promise<string> {
    const { JWT_SECRET, JWT_EXPIRATION } = this.getJsonWebTokenConfig();
    return this.jwtService.signAsync(payload, {
      secret: JWT_SECRET,
      expiresIn: JWT_EXPIRATION,
    });
  }
  async verfiyAccessToken(token: string): Promise<any> {
    const { JWT_SECRET } = this.getJsonWebTokenConfig();
    return this.jwtService.verifyAsync(token, {
      secret: JWT_SECRET,
    });
  }
  async decodeAccessToken(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }
}
