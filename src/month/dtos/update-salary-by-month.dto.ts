import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator"


export class UpdateSalaryByMonthDTO {

    @ApiProperty()
    @IsNumber()
    year:string

    @ApiProperty()
    @IsString()
    month:string

    @ApiProperty()
    @IsNumber()
    quantity: number;

    @ApiProperty()
    @IsString()
    type: string
}