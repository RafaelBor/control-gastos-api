import { ExceptionEnum } from "../enum/exception.enum";
import { HttpExceptionResponse } from "./http-exception-response.interface";

export interface DomainException extends HttpExceptionResponse {
  type: ExceptionEnum;
}
export interface MsNotRespondingException extends DomainException {
  type: ExceptionEnum.MS_NOT_RESPONDING;
}

export interface InvalidTokenException extends DomainException {
  type: ExceptionEnum.INVALID_TOKEN;
}

export interface UnauthorizedLoginException extends DomainException {
  type: ExceptionEnum.UNAUTHORIZED_LOGIN;
}

export interface ProcessDocumentsException extends DomainException {
  type: ExceptionEnum.PROCESS_DOCUMENTS;
}

export interface ForbiddenCustomException extends DomainException {
  type: ExceptionEnum.FORBIDDEN;
}

export interface MSErrorException extends DomainException {
  type: ExceptionEnum.MS_ERROR;
}

export interface NotFoundCustomException extends DomainException {
  type: ExceptionEnum.NOT_FOUND;
}

export interface BadRequestCustomException extends DomainException {
  type: ExceptionEnum.BAD_REQUEST;
}

export interface DbTransactionException extends DomainException {
  type: ExceptionEnum.DB_TRANSACTION;
}
