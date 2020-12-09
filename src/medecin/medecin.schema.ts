import * as mongoose from 'mongoose';

export enum TypeMedecin {
  'MEDECIN_FULL' = 'MEDECIN_FULL',
  'MEDECIN_PARTIEL' = 'MEDECIN_PARTIEL',
  'INFIRMIER' = 'INFIRMIER',
}
export interface MedecinInterface extends mongoose.Document {
    name: string;

    images: string;
    numero: string;
    address: string;
    password: string;
    recovery: string;
    matricule: string;
    wallet: number;
    mesRendezVous: string[];
    clientFidele: string[];
    firstDay: any[];
    secondDay: any[];
    thirdDay: any[];
    fourDay: any[];
    fiveDay: any[];
    sixDay: any[];
    sevenDay: any[];
    email: string;
    registerDate: Date;
    loginDate?: Date;
    dateReceive: Date;
    speciality: string;
    isActivate: boolean;
    validateByAdmin: boolean;
    typeMedecin: TypeMedecin;
  }

  export const MedecinSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    matricule: {
      type: String,
    },
    images: {
      type: String,
    },
    address: {
        type: String,
      },
    dateReceive: {
      type: Date,
      default: new Date,
    },
    isActivate: {
        type: Boolean,
        default: false,
      },
    validateByAdmin: {
        type: Boolean,
        default: false,
      },
      typeMedecin: {
        type: TypeMedecin,
      },
    password: {
      // code for unlock order
      type: String,
    },
    // level: {
    //   type: String,
    //   default: BEGINER,
    // },
    numero: {
      type: String,
      require: true,
    },
    speciality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Speciality',
      },
    mesRendezVous: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'RendezVous',
        },
      ],
    clientFidele: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
      },
    ],
    firstDay: [
        {type: Object}
    ],
    secondDay: [
        {type: Object}
    ],
    thirdDay: [
        {type: Object}
    ],
    fourDay: [
        {type: Object}
    ],
    fiveDay: [
        {type: Object}
    ],
    sixDay: [
        {type: Object}
    ],
    sevenDay: [
        {type: Object}
    ],
    
    recovery: {
      type: String,
      require: true,
    },
    wallet: {
      type: Number,
      default: 0,
    },

    email: {
      type: String,
    },
    loginDate: {
      type: Date,
    },
    registerDate: {
      type: Date,
      default: new Date(),
    },
  });