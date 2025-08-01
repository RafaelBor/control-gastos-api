import {
    ForbiddenCustomException,
    InvalidTokenException,
    MSErrorException,
    BadRequestCustomException,
    DbTransactionException,
    MsNotRespondingException,
    NotFoundCustomException,
    ProcessDocumentsException,
    UnauthorizedLoginException,
  } from "../interfaces/exception.interface";


  export type Exception =
    | MsNotRespondingException
    | InvalidTokenException
    | UnauthorizedLoginException
    | ForbiddenCustomException
    | MSErrorException
    | NotFoundCustomException
    | BadRequestCustomException
    | ProcessDocumentsException
    | DbTransactionException;