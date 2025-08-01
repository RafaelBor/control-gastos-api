import { HttpException, HttpStatus } from "@nestjs/common";
import { HttpExceptionResponse } from "../interfaces/http-exception-response.interface";
import { Exception } from "../types/exception.type";
import { ExceptionEnum } from "../enum/exception.enum";
import { getEnumStringKey } from "../utils/enum.utils";

export class HttpExceptionWM extends HttpException {
  constructor(exception: Exception) {
    const response = getExceptionDetail(exception);
    super(response, response.statusCode);
  }
}

const getExceptionDetail = (exception: Exception): HttpExceptionResponse => {
  let { remoteExceptionName, message } = exception;
  const messageDetail = exception.messageDetail;
  const exceptionName = getEnumStringKey(ExceptionEnum, exception.type);
  let statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  switch (exception.type) {

    case ExceptionEnum.INVALID_TOKEN:
      remoteExceptionName = exceptionName;
      statusCode = HttpStatus.UNAUTHORIZED;
      message = `No se ha podido autorizar el usuario`;
      break;

    case ExceptionEnum.UNAUTHORIZED_LOGIN:
      remoteExceptionName = exceptionName;
      statusCode = HttpStatus.UNAUTHORIZED;
      break;

    case ExceptionEnum.FORBIDDEN:
      remoteExceptionName = exceptionName;
      statusCode = HttpStatus.FORBIDDEN;
      break;

    case ExceptionEnum.MS_ERROR:
      remoteExceptionName = exceptionName;
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = `Error en respuesta del micro servicio`;
      break;

    case ExceptionEnum.NOT_FOUND:
      remoteExceptionName = exceptionName;
      statusCode = HttpStatus.NOT_FOUND;
      break;

    case ExceptionEnum.BAD_REQUEST:
      remoteExceptionName = exceptionName;
      statusCode = HttpStatus.BAD_REQUEST;
      break;

    case ExceptionEnum.DB_TRANSACTION:
      remoteExceptionName = exceptionName;
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      break;
  }

  return {
    success: false,
    data: null,
    statusCode,
    message,
    messageDetail,
    remoteExceptionName,
    exceptionName,
  };
};