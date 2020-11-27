import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { coreEncode } from 'crypto-core';
import { Model } from 'mongoose';
import { ReponseServiceGeneral } from 'src/common/interfaces/response.interfaces';
import { CreateAdminDto, LoginDto } from './admin.dto';
import { AdminInterface } from './admin.schema';
import { generateRecovery } from '../common/functions/Globals';
import { ConseilsInterface, PathologieInterface, SpecialityInterface } from './model.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel('Admin') private readonly adminModel: Model<AdminInterface>,
        @InjectModel('Speciality') private readonly specialityModel: Model<SpecialityInterface>,
        @InjectModel('Pathologie') private readonly pathologieModel: Model<PathologieInterface>,
        @InjectModel('Conseils') private readonly conseilsModel: Model<ConseilsInterface>,
      ) {}

      // Admin

      async verifyAdminById(id: string): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.adminModel
            .findOne({ _id:id })
            .then(result => {
              if (result) {
                    next({ etat: true, result })
              }else {
                next({ etat: false, error: new Error('Admin introuvable') });
              }
            })
            .catch(error => next({ etat: false, error }));
        });
      }
    async verifyAdmin(info: LoginDto): Promise<ReponseServiceGeneral> {
        const password = coreEncode(info.password, parseInt(process.env.CRYPTO_DIGEST, 10));
        return new Promise(async next => {
          await this.adminModel
            .findOne({ email: info.email.trim(), password })
            .then(async result => {
              if (result) {
                  result.loginDate = new Date();
                  await result.save().then((updateAdmin)=> {
                    next({ etat: true, result: {id: result._id, level: 3} })
                  }).catch(error => next({ etat: false, error: new Error('Probleme avec le serveur') }))
              }else {
                next({ etat: false, error: new Error('Email ou Mot de passe incorrect') });
              }
            })
            .catch(error => next({ etat: false, error: new Error('Probleme avec le serveur') }));
        });
      }
      async createAdmin(admin: CreateAdminDto): Promise<ReponseServiceGeneral> {
        const password = coreEncode(admin.password, parseInt(process.env.CRYPTO_DIGEST, 10));
        const recovery = generateRecovery();
        return new Promise(async next => {
            const newAdmin = new this.adminModel({...admin, password,recovery});
          await newAdmin.save()
            .then(async result => {
                next({ etat: true, result: {id: result._id, level: 3} })
            })
            .catch(error => next({ etat: false, error: new Error('Probleme avec le serveur') }));
        });
      }

      // Speciality
      async createSpeciality(name: string): Promise<ReponseServiceGeneral> {
        
        return new Promise(async next => {
            const newSpeciality = new this.specialityModel({name});
          await newSpeciality.save()
            .then(result => {
                next({ etat: true, result })
            })
            .catch(error => next({ etat: false, error: new Error('Probleme avec le serveur') }));
        });
      }

      async createConseil(title: string, type:number, content: string): Promise<ReponseServiceGeneral> {
        
        return new Promise(async next => {
            const newConseils = new this.conseilsModel({title, type, content});
          await newConseils.save()
            .then(result => {
                next({ etat: true, result })
            })
            .catch(error => next({ etat: false, error: new Error('Probleme avec le serveur') }));
        });
      }

      async getAllConseilsByType(type: number): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.conseilsModel
            .find({type})
            .then(result => {
              next({ etat: true, result })
            })
            .catch(error => next({ etat: false, error }));
        });
      }

      async verifySpeciality(name: string): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.specialityModel
            .findOne({ name })
            .then(result => {
              if (result) {
                    next({ etat: true, result })
              }else {
                next({ etat: false, error: new Error('Specialité introuvable') });
              }
            })
            .catch(error => next({ etat: false, error }));
        });
      }



      async getAllSpeciality(): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.specialityModel
            .find()
            .then(result => {
              next({ etat: true, result })
            })
            .catch(error => next({ etat: false, error }));
        });
      }

      // Pathologie
      async createPathologie(name: string, speciality: string): Promise<ReponseServiceGeneral> {
        
        return new Promise(async next => {
            const newPathologie = new this.pathologieModel({name, speciality});
          await newPathologie.save()
            .then(result => {
                next({ etat: true, result })
            })
            .catch(error => next({ etat: false, error: new Error('Probleme avec le serveur') }));
        });
      }

      async getAllPathologie(): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.pathologieModel
            .find()
            .populate('speciality')
            .then(result => {
              next({ etat: true, result })
            })
            .catch(error => next({ etat: false, error }));
        });
      }


      async getAllPathologieBySpeciality(speciality: string): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.pathologieModel
            .find({speciality})
            .populate('speciality')
            .then(result => {
              next({ etat: true, result })
            })
            .catch(error => next({ etat: false, error }));
        });
      }

      async getPathologieByItem(item): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.pathologieModel
            .findOne(item)
            .populate('speciality')
            .then(result => {
              next({ etat: true, result })
            })
            .catch(error => next({ etat: false, error }));
        });
      }
}
