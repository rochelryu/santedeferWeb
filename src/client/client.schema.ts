import * as mongoose from 'mongoose';

interface OtherUser {
  name: string,
  address: string,
  old: number,
}


export interface RendezVousInterface extends mongoose.Document{
  speciality?: string, //cause of malaria
  description?: string, //cause of malaria
  diagnostic?: string, //metionned by medecin
  automedication?: string, //metionned by medecin
  dateDuRendezVous?: Date, 
  traitement?: string, //metionned by medecin
  medecinTraitant?: string, //medecin id
  client?: string, //client id
  registerDate: Date,
  isDone: number,
  lieuDuRendezVous?: string,
  typeRdv: number, //0 for standard and 1 for fidel
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
    antecedent: string[];
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
    antecedent: [
    {
      type: String,
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
    speciality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Speciality',
    },
    description: {
      type: String,
    },
    diagnostic: {
        type: String,
      },

    automedication: {
        type: String,
      },
    lieuDuRendezVous: {
        type: String,
    },
    dateDuRendezVous: {
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
    
    registerDate: {
      type: Date,
      default: new Date(),
    },
});