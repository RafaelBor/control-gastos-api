import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength, Matches, IsNotEmpty } from "class-validator"


export class createUserDto{

    @ApiProperty()
    @IsEmail()
    email:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastname:string

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
}