import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { TypeMedecin } from 'src/medecin/medecin.schema';

export class LoginClientDto {
  @IsString()
  readonly numero: string;
  @IsString()
  readonly password: string;
  
}

class RequestClient {
    @IsNotEmpty()
    @IsString()
    readonly _id: string;
    @IsNotEmpty()
    @IsString()
    readonly recovery: string;
  }

export class CreateAntecedentDto extends RequestClient {
    @IsString()
    @IsNotEmpty()
    readonly antecedent: string;
  }

  export class ChangeProfilPictureDto extends RequestClient {
    @IsString()
    @IsNotEmpty()
    readonly image: string;
    @IsNotEmpty()
    readonly base64: string;
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


  export class QueryHeaderClientDto {
    readonly _id: string;
    readonly recovery: string;
  }

  export class QueryHeaderClientForGetRendezVousDto extends QueryHeaderClientDto {
    readonly rendezVousId: string;
  }

  export interface QueryHeaderClientSearchMedecinDto extends QueryHeaderClientDto {
    readonly speciality: string,
    readonly typeMedecin: TypeMedecin,
    readonly address: string,
  }


  export interface CreateRendezVousFirstStepDTO {speciality: string,  description: string, address: string, id:string}
  export interface CreateRendezVousFinalDTO {speciality: string,  description: string, id:string, diagnostic: string,  automedication: string, dateDuRendezVous: string, base64: string,imageName: string, recovery: string}
  export interface UpdateRendezVousFinalDTO {rendezVousId: string,  description: string, id:string, diagnostic: string,  automedication: string, base64: string,imageName: string, recovery: string}
