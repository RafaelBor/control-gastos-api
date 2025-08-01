import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AddCategoryDto{


    @ApiProperty()
    @IsString()
    name: string
}