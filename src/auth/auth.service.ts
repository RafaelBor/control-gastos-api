import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { User } from './entities/auth.entity';
import * as bcrypt from 'bcrypt'
import { loginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { BaseResponseModel, LoginResponseModel } from 'src/common/models/base';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}

  async create(createAuthDto: createUserDto) {
    try {
      const {password, ...userData} = createAuthDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      await this.userRepository.save(user)

      // delete user.password;
      const { password: _, ...userWithoutPassword } = user;

      const response:BaseResponseModel<User> = {
        code: '200',
        message:'Peticion exitosa',
        data: userWithoutPassword as User,
      }
      return response;
    } catch (error) {
      console.log(error)
    }
  }


  async login(loginUserDto: loginUserDto){
    
    const {password, email} = loginUserDto

    const user = await this.userRepository.findOne({
      where: {email},
      select: {email:true, password:true, id:true}
    })

    if(!user){
      throw new UnauthorizedException('El email es incorrecto')
    }

    if(!bcrypt.compareSync(password, user.password))
          throw new UnauthorizedException('La password es incorrecta')

    const userWithoutPassword = await this.userRepository.findOne({
      where: {email}
    })

    const response:LoginResponseModel<User> = {
      code: '200',
      message:'Peticion exitosa',
      data: userWithoutPassword,
      token: this.getJwtToken({id: user.id})

    }
    return response;
    
  }


  private getJwtToken(payload: JwtPayload){

    const token = this.jwtService.sign(payload);

    return token;
}

 
}
