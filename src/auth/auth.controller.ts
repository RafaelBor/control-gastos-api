import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';
import { createUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { UserEntity } from './entities/auth.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces/valid-role.interface';
import { httpResponse } from 'src/common/utils/http-response.util';
import { VerifyEmailDto } from './dto/verify-email.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  async create(@Body() createUserDto: createUserDto) {
    const res = await this.authService.create(createUserDto);

    return httpResponse(res, 'Se ha registrado correctamente')
  }

  @Post('login')
  async login(@Body() loginUserDto: loginUserDto) {
    const res = await this.authService.login(loginUserDto);

    return httpResponse(res, 'Se ha autentificado correctamente')
  }

  @Get('user-info')
  @Auth()
  async getUserInfo(
    @GetUser() user: UserEntity
  ){
    const res = await this.authService.getInfoUser(user);

    return httpResponse(res, 'Informacion obtenida correctamente')
  }

  @Get('check-token')
  @Auth()
  checkToken(
    @GetUser() user: UserEntity
  ){
    return httpResponse({    
      user,
      token: this.authService.getJwtToken({id: user.id})}, 'Se ha realizado la operacion correctamente')
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyDto: VerifyEmailDto) {
    return this.authService.verifyEmailCode(verifyDto);
  }

 @Post('send-verification')
 async sendVerificationCode(@Body() dto: { email: string }) {

  const res = await this.authService.resendVerificationCode(dto)

  return httpResponse(res, 'Informacion obtenida correctamente')
 }



  // @Get('test')
  // @RoleProtected(ValidRoles.admin)
  // @UseGuards(AuthGuard(), UserRoleGuard)
  // test(
  //   @GetUser() user: UserEntity,
  //   @GetUser('email') userEmail
  //   ){
  //   return{
  //     "test":true,
  //     user,
  //     userEmail
  //   }
  // }


  // @Get('test2')
  // @Auth(ValidRoles.admin)
  // test2(
  //   @GetUser() user: UserEntity,
  //   @GetUser('email') userEmail
  //   ){
  //   return{
  //     "test":true,
  //     user,
  //     userEmail
  //   }
  // }
}
