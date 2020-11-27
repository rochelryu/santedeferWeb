import * as mongoose from 'mongoose';

interface Antecendant {
  pathologie: string,
  description?: string,
  resultat: string,
}

interface OtherUser {
  name: string,
  address: string,
  old: number,
}


export interface RendezVousInterface extends mongoose.Document{
  pathologie?: string, //cause of malaria
  description?: string, //cause of malaria
  diagnostic?: string, //metionned by medecin
  resultat?: string, //metionned by medecin
  lieuDuRendezVous?: string,
  dateDuRendezVous?: Date; 
  exeat?: Date; //metionned by medecin
  aRevoirLe?: Date; //metionned by medecin
  intervention?: string, //metionned by medecin
  suiteOperatoire?: string, //metionned by medecin
  traitement?: string, //metionned by medecin
  medecinTraitant?: string, //medecin id
  client?: string, //client id
  otherUser?: OtherUser,
  registerDate: Date,
  isDone: number,
  typeRdv: number, //0 for standard and 1 for fidel
  isMe: boolean,
  medecinDone: boolean,
  patientDone: boolean,
}

export interface ClientInterface extends mongoose.Document {
    name: string;

    images: string;
    numero: string;
    address: string;
    groupeSanguin: string;
    password: string;
    recovery: string;
    prefix: string;
    email: string;
    wallet: number;
    numberRdvNever: number;
    mesRendezVous: string[];
    listMedecin: string[];
    antecendent: Antecendant[];
    registerDate: Date;
    birthDate: Date;
    loginDate?: Date;
    
    isActivate: boolean;
  }

export const ClientSchema = new mongoose.Schema({
    name: {
      type: String,
      require: true,
    },
    images: {
      type: String,
      default:'medical-mask.png',
    },
    address: {
        type: String,
      },

    groupeSanguin: {
        type: String,
        require: true,
      },

    isActivate: {
        type: Boolean,
        default: true,
      },
    password: {
      type: String,
      require: true,
    },
    // level: {
    //   type: String,
    //   default: BEGINER,
    // },
    birthDate: {
      type: Date,
      require: true,
    },
    numero: {
      type: String,
      require: true,
    },
    recovery: {
      type: String,
      require: true,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    numberRdvNever: {
      type: Number,
      default: 0,
    },
    prefix: {
      type: String,
      default: '+225',
    },

    email: {
      type: String,
      default: "",
    },

    mesRendezVous: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RendezVous',
      },
    ],

    listMedecin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medecin',
      },
    ],
    antecendent: [
    {
      type: Object,
    },
  ],
    
    loginDate: {
      type: Date,
    },
    registerDate: {
      type: Date,
      default: new Date(),
    },
});

export const RendezVousSchema = new mongoose.Schema({
    pathologie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pathologie',
    },
    description: {
      type: String,
    },
    diagnostic: {
        type: String,
      },

    resultat: {
        type: String,
      },

    lieuDuRendezVous: {
      type: String,
    },
    dateDuRendezVous: {
      type: Date,
    },
    exeat: {
      type: Date,
    },
    aRevoirLe: {
      type: Date,
    },
    isDone: {
      type: Number,
      default: 0,
    },
    typeRdv: {
      type: Number,
      default: 0,
    },

    intervention: {
      type: String,
    },
    suiteOperatoire: {
      type: String,
    },

    otherUser : {
      type:Object,
    },
    traitement: {
      type: String,
    },

    medecinTraitant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medecin',
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },

    medecinDone: {
      type: Boolean,
      default: false,
    },

    isMe : {
      type: Boolean,
      default: true,
    },

    patientDone: {
      type: Boolean,
      default: false,
    },
    
    registerDate: {
      type: Date,
      default: new Date(),
    },
});