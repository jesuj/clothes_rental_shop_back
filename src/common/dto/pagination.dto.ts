import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto{
    
    @IsOptional()
    @Min(0)
    @Type(()=> Number)
    limit?: number;

    @IsOptional()
    @Min(1)
    @Type(()=> Number)
    offset?: number;
}