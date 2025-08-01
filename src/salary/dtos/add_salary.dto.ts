import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class addSalaryDto{

    @ApiProperty()
    @IsNumber()
    salary:number
}