import * as mongoose from 'mongoose';

export interface AdminInterface extends mongoose.Document {
    name: string;
    numero: string;
    password: string;
    recovery: string;

    email: string;
    registerDate: Date;
    loginDate?: Date;
    
    isActivate: boolean;
  }

  export const AdminSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    isActivate: {
        type: Boolean,
        default: true,
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
    
    recovery: {
      type: String,
      require: true,
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