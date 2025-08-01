import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { use } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { UserEntity } from "../entities/auth.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        private configService:ConfigService

    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret', // Proveer un valor predeterminado
          });
    }

    async validate(payload:JwtPayload): Promise<UserEntity>{

        const {id} = payload

        const user = await this.userRepository.findOneBy({id})

        //VALIDACIONES
        if(!user){
            throw new UnauthorizedException('Token no valido');
        }
            
   
        return user;
    }

    
}