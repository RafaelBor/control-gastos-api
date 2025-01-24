import { IsEmail, IsString, MinLength, MaxLength, Matches, IsNotEmpty } from "class-validator"


export class createUserDto{

    @IsEmail()
    email:string

    @IsString()
    @IsNotEmpty()
    nombre:string

    @IsString()
    @IsNotEmpty()
    apellidos:string

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
}