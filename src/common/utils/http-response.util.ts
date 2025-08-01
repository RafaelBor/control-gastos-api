import { HttpStatus } from "@nestjs/common";
import { HttpCorrectResponse } from "../interfaces/http-correct-response.interface";

export const httpResponse = (
    data: any = null,
    message: string | undefined = "Correcto",
    statusCode: number = HttpStatus.OK
  ): HttpCorrectResponse => {
    return {
      statusCode,
      message,
      data,
    };
  };