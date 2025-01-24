import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLE } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const ValidRole:string[] = this.reflector.get( META_ROLE, context.getHandler())

    /*
    console.log(ValidRole)
    if(!ValidRole || ValidRole.length === 0)
      throw new InternalServerErrorException('No hay validacion de rol')
    */

    if(!ValidRole || ValidRole.length === 0)
      return true
    

    
    const req = context.switchToHttp().getRequest()
    const user = req.user;

    
    if(!user)
      throw new BadRequestException('Usuario no encontrado')

    if(user.role == ValidRole[0])
      return true;

    throw new ForbiddenException('El usuario no tiene permisos')
  }
}
