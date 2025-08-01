
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class addExpenseDto{

    @ApiProperty()
    @IsNumber()
    expense:number

    @ApiProperty()
    @IsString()
    date: string

    @ApiProperty({
        default: ''
    })
    @IsString()
    detail: string

    @ApiProperty({
        default: ''
    })
    @IsString()
    categoryId: string
}