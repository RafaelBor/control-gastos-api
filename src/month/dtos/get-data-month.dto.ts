
import { IsDate, IsNumber, IsString } from "class-validator";

export class getDataMonthDTO{

    @IsString()
    year:string

    @IsString()
    month:string
}