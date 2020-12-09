import { IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @IsString()
  readonly email: string;
  @IsString()
  readonly password: string;
  
}


export class CreateAdminDto {
    @IsString()
    readonly name: string;
    @IsString()
    readonly numero: string;
    @IsString()
    readonly email: string;
    @IsString()
    readonly password: string;
    
  }

  export class CreateMedecinDto {
    @IsString()
    readonly name: string;
    @IsString()
    readonly matricule: string;
    @IsString()
    readonly numero: number;
    @IsString()
    readonly email: string;
    @IsString()
    readonly speciality: string;
    @IsString()
    readonly typeMedecin: string;
    @IsString()
    readonly password: string;
    @IsString()
    readonly address: string;
    
  }
