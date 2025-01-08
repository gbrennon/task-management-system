import { IsString, IsNotEmpty, IsUUID, Length } from 'class-validator';

export class CreateTaskRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 500)
  description: string;

  @IsUUID() // Validates that the value is a valid UUID
  ownerId: string;
}
