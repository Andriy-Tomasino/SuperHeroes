import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSuperheroDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  real_name: string;

  @IsString()
  @IsNotEmpty()
  origin_description: string;

  @IsString()
  @IsNotEmpty()
  superpowers: string;

  @IsString()
  @IsNotEmpty()
  catch_phrase: string;
}
