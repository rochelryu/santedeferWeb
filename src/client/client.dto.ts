import { IsString, IsEmail } from 'class-validator';
import { TypeMedecin } from 'src/medecin/medecin.schema';

export class LoginClientDto {
  @IsString()
  readonly numero: string;
  @IsString()
  readonly password: string;
  
}


export class CreateClientDto {
    @IsString()
    readonly name: string;
    @IsString()
    readonly numero: string;
    @IsString()
    readonly address: string;
    @IsString()
    readonly birthDate: string;
    @IsString()
    readonly groupeSanguin: string;
    @IsString()
    readonly password: string;
    
  }


  export class CreateRendezVousLastStepDTO {
    @IsString()
    readonly id: string;
    @IsString()
    readonly medecinTraitant: string;
    @IsString()
    readonly numberDay: string;
    @IsString()
    readonly horaireIndex: string;
    @IsString()
    readonly rdvId: string;
    @IsString()
    readonly lieuRdv: string;
    
  }


  export interface QueryHeaderClientDto {
    readonly _id: string,
    readonly recovery: string,
  }

  export interface QueryHeaderClientSearchMedecinDto extends QueryHeaderClientDto {
    readonly speciality: string,
    readonly typeMedecin: TypeMedecin,
    readonly address: string,
  }


  export interface CreateRendezVousFirstStepDTO {speciality: string, isMe: string, nameOther: string, addressOther: string, oldOther: string, description: string, id:string}
