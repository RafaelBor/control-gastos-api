import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/auth.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserInfoEntity } from 'src/common/entities/user_info.entity';
import { EmailVerificationEntity } from './entities/email-verification.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserInfoEntity, EmailVerificationEntity]),
    PassportModule.register({defaultStrategy: 'jwt'}),

    ConfigModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:(configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'), 
          signOptions: {
            expiresIn: '1d'
          }
        }
      }
     
    })
  ],
  exports: [JwtStrategy, TypeOrmModule, PassportModule, JwtModule]
})
export class AuthModule {}
