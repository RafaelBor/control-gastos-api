import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt'
import { loginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { BaseResponseModel, LoginResponseModel } from 'src/common/models/base';
import { categoriesSeeder } from 'src/database/seeders/categories.seeder';
import { HttpExceptionWM } from 'src/common/exceptions/http.exception';
import { ExceptionEnum } from 'src/common/enum/exception.enum';
import { UserInfoEntity } from 'src/common/entities/user_info.entity';
import { EmailVerificationEntity } from './entities/email-verification.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyEmailDto } from './dto/verify-email.dto';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,

    @InjectRepository(EmailVerificationEntity)
    private readonly emailVerificationRepository: Repository<EmailVerificationEntity>,

    private readonly mailerService: MailerService,

    private readonly jwtService: JwtService
  ){}

  async create(createAuthDto: createUserDto) {
    try {
      const {password, ...userData} = createAuthDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        userInfo: {
          salary: 0,
          saving: 0
        },
        categories: categoriesSeeder
      })

      await this.userRepository.save(user)

      const { password: _, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      console.log(error)
      throw new HttpExceptionWM({
          statusCode: 500,
          type: ExceptionEnum.MS_ERROR,
          message: "Ocurrió un error interno al procesar la solicitud",
      });
    }
  }


  async login(loginUserDto: loginUserDto){
    
    const {password, email} = loginUserDto

    const user = await this.userRepository.findOne({
      where: {email},
      select: {email:true, password:true, id:true, verified:true}
    })

    if(!user){
      throw new HttpExceptionWM({
        statusCode: 400,
        type: ExceptionEnum.UNAUTHORIZED_LOGIN,
        message: `El email es incorrecto.`,
      });
    }

    if(!bcrypt.compareSync(password, user.password))
        throw new HttpExceptionWM({
          statusCode: 400,
          type: ExceptionEnum.UNAUTHORIZED_LOGIN,
          message: `La password es incorrecta`,
      });

    if(!user.verified){
      throw new HttpExceptionWM({
          statusCode: 400,
          type: ExceptionEnum.FORBIDDEN,
          message: `Correo no verificado. Ingresa el código que se envió a tu email.`,
      });
    }

    const userData = await this.userRepository.findOne({
      where: {email}
    })

    return {
      userData,
      token: this.getJwtToken({id: user.id})
    }
    
  }

  async getInfoUser(user: UserEntity){

    const res = await this.userInfoRepository.findOne({
      where: {
        user: user
      }
    })

    return res;
  }

getJwtToken(payload: JwtPayload){

  const token = this.jwtService.sign(payload);

  return token;
} 

 async checkToken(){

 }

async generateVerificationCode(): Promise<string> {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}

async verifyEmailCode(dto: VerifyEmailDto) {
  const user = await this.userRepository.findOne({
    where: { email: dto.email },
  });

  if (!user) {
    throw new HttpExceptionWM({
      statusCode: 404,
      type: ExceptionEnum.MS_ERROR,
      message: 'Usuario no encontrado',
    });
  }

  const record = await this.emailVerificationRepository.findOne({
    where: {
      user: { id: user.id },
      code: dto.code,
    },
    relations: ['user'],
  });

  if (!record || record.expiresAt < new Date()) {
    throw new HttpExceptionWM({
      statusCode: 400,
      type: ExceptionEnum.MS_ERROR,
      message: 'Código inválido o expirado',
    });
  }

  user.verified = true; // O en UserEntity si agregas `verified`
  await this.userRepository.save(user);

  // Borra el código
  await this.emailVerificationRepository.delete({ id: record.id });

  return { message: 'Correo verificado exitosamente' };
}


async resendVerificationCode(dto: {email: string}){
  const user = await this.userRepository.findOne({
    where: { email: dto.email },
  });
  console.log(dto.email)
  console.log(user)
  if (!user) {
    throw new HttpExceptionWM({
      statusCode: 404,
      type: ExceptionEnum.MS_ERROR,
      message: 'Usuario no encontrado',
    });
  }

  // Eliminar código anterior (si existe)
  await this.emailVerificationRepository.delete({
    user: { id: user.id },
  });

  const verificationCode = await this.generateVerificationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

  await this.emailVerificationRepository.save({
    user,
    code: verificationCode,
    expiresAt,
  });

  const emailTemplate = this.getVerificationEmailTemplate(user.email, verificationCode)

  await this.mailerService.sendMail({
    to: user.email,
    subject: 'Verifica tu correo para MiauHORROS',
    html: emailTemplate,
  });

  return { message: 'Se envió un nuevo código de verificación' };
}


 private getVerificationEmailTemplate(userEmail: string, verificationCode: string): string {
    // Aquí puedes cargar el template desde un archivo o usar el HTML directamente
    const template = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificación de Correo - MiauHORROS</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 30px; text-align: center;">
                                <div style="display: inline-block; position: relative; margin-bottom: 20px;">
                                    <div style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 16px; border: 2px solid rgba(255, 255, 255, 0.3); display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                                        <span style="font-size: 40px; opacity: 0.9;">🐱</span>
                                    </div>
                                    <div style="position: absolute; bottom: -8px; right: -8px; width: 32px; height: 32px; background: linear-gradient(135deg, #a855f7, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">$</div>
                                </div>
                                <h1 style="margin: 0; color: white; font-size: 32px; font-weight: bold;">Miau<span style="color: #e9d5ff;">HORROS</span></h1>
                                <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Verificación de Correo Electrónico</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600; text-align: center;">¡Bienvenido a MiauHORROS! 🎉</h2>
                                
                                <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6; text-align: center;">
                                    Para completar tu registro, ingresa el siguiente código de verificación:
                                </p>
                                
                                <!-- Code Section -->
                                <div style="background: linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%); border: 2px solid #e9d5ff; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                                    <p style="margin: 0 0 15px 0; color: #7c3aed; font-size: 14px; font-weight: 600; text-transform: uppercase;">Tu código de verificación</p>
                                    
                                    <div style="background: white; border: 2px solid #8b5cf6; border-radius: 8px; padding: 20px; margin: 15px 0; display: inline-block;">
                                        <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #7c3aed; letter-spacing: 8px;">${verificationCode}</span>
                                    </div>
                                    
                                    <p style="margin: 15px 0 0 0; color: #8b5cf6; font-size: 14px;"><strong>⏰ Expira en 10 minutos</strong></p>
                                </div>
                                
                                <!-- Security Notice -->
                                <div style="background: #fef3cd; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0;">
                                    <p style="margin: 0; color: #92400e; font-size: 14px; text-align: center;">🔒 Si no solicitaste esta verificación, ignora este correo.</p>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">
                                    ¿Necesitas ayuda? Contáctanos en <a href="mailto:soporte@miauhorros.com" style="color: #8b5cf6;">soporte@miauhorros.com</a>
                                </p>
                                <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">© 2024 MiauHORROS. Enviado a ${userEmail}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `

    return template
  }

 
}
