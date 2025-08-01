export interface HttpExceptionResponse {
    exceptionName?: string;
    remoteExceptionName?: string;
    date?: Date;
    path?: any;
    method?: any;
    statusCode: number;
    message?: string;
    messageDetail?: string;
    data?: any;
    success?: boolean;
  }
  