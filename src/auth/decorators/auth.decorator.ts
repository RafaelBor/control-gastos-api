import { applyDecorators, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidRoles } from '../interfaces/valid-role.interface';
import { RoleProtected } from './role-protected.decorator';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { InternalError, Unauthorized, ResponseCorrect } from 'src/common/swagger/swagger.api-response';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiInternalServerErrorResponse(InternalError),
    ApiUnauthorizedResponse(Unauthorized),
    ApiOkResponse(ResponseCorrect),
    ApiBearerAuth(),
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}