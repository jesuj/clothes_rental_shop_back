import { IsBoolean, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
    
    @IsString()
    name: string; 

    @IsNumberString()
    @IsOptional()
    phone_number?: string;

    @IsBoolean()
    @IsOptional()
    have_ci?: boolean;
}
