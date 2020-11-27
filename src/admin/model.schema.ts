import * as mongoose from 'mongoose';

export interface SpecialityInterface extends mongoose.Document {
    name: string;
  }

export const SpecialitySchema = new mongoose.Schema({
    name: {
      type: String,
    },
  });

export interface ConseilsInterface extends mongoose.Document {
    title: string;
    type: number;
    content: string;
    registerDate: Date;
  }

export const ConseilsSchema = new mongoose.Schema({
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    type: {
      type: Number,
    },
    registerDate: {
      type: Date,
      default: new Date(),
    },
  });

export interface PathologieInterface extends mongoose.Document {
    name: string;
    speciality: string;
  }

export const PathologieSchema = new mongoose.Schema({
    name: {
      type: String,
    },

    speciality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Speciality',
      },
  });

  