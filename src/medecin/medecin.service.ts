import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { coreEncode } from 'crypto-core';
import { Model } from 'mongoose';
import { CreateAdminDto, CreateMedecinDto, LoginDto } from 'src/admin/admin.dto';
import { generateRecovery, generateEmploie } from 'src/common/functions/Globals';
import { ReponseServiceGeneral } from 'src/common/interfaces/response.interfaces';
import { UpdateEmploieDuTemps } from './medecin.dto';
import { MedecinInterface } from './medecin.schema';
import { TypeMedecin } from './medecin.schema';

@Injectable()
export class MedecinService {

    constructor(
        @InjectModel('Medecin') private readonly medecinModel: Model<MedecinInterface>,
      ) {}



      async verifyMedecinById(id: string): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.medecinModel
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

      async updateEmploieDuTempsMedecinById(id: string, emploieDuTemps: UpdateEmploieDuTemps): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.medecinModel
            .findOne({ _id:id })
            .then(async result => {
              if (result) {
                for(let i = 0; i < emploieDuTemps.firstDay.length; i++) {
                  result.firstDay[i] = {
                    isBusy: emploieDuTemps.firstDayCheckbox[i] === "on",
                    value: emploieDuTemps.firstDay[i]
                  };
                  result.secondDay[i] = {
                    isBusy: emploieDuTemps.secondDayCheckbox[i] === "on",
                    value: emploieDuTemps.secondDay[i]
                  };
                  result.thirdDay[i] = {
                    isBusy: emploieDuTemps.thirdDayCheckbox[i] === "on",
                    value: emploieDuTemps.thirdDay[i]
                  };
                  result.fourDay[i] = {
                    isBusy: emploieDuTemps.fourDayCheckbox[i] === "on",
                    value: emploieDuTemps.fourDay[i]
                  };
                  result.fiveDay[i] = {
                    isBusy: emploieDuTemps.fiveDayCheckbox[i] === "on",
                    value: emploieDuTemps.fiveDay[i]
                  };
                  result.sixDay[i] = {
                    isBusy: emploieDuTemps.sixDayCheckbox[i] === "on",
                    value: emploieDuTemps.sixDay[i]
                  };
                  result.sevenDay[i] = {
                    isBusy: emploieDuTemps.sevenDayCheckbox[i] === "on",
                    value: emploieDuTemps.sevenDay[i]
                  };
                }
                await this.medecinModel.updateOne({ _id:id }, result).then(res => next({ etat: true, result: res })).catch(error => next({ etat: false, error }))
                    
              } else {
                next({ etat: false, error: new Error('Medecin introuvable') });
              }
            })
            .catch(error => next({ etat: false, error }));
        });
      }

      async updateMedecinForActivate(id: string): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.medecinModel.updateOne({ _id:id }, {isActivate: true, dateReceive: new Date}).then(res => next({ etat: true, result: res })).catch(error => next({ etat: false, error }))
        });
      }

      async updateMedecinForActivateAdmin(id: string): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.medecinModel.updateOne({ _id:id }, {validateByAdmin: true}).then(res => next({ etat: true, result: res })).catch(error => next({ etat: false, error }))
        });
      }

      async deleteMedecinByAdmin(id: string): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.medecinModel.deleteOne({ _id:id }).then(res => next({ etat: true, result: res })).catch(error => next({ etat: false, error }))
        });
      }

      async updateMedecinForRdv(id: string, jrChoice: string, horaireIndex: number, rdvId: string): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.medecinModel
            .findOne({ _id:id })
            .then(async result => {
              if (result) {
                result[jrChoice][horaireIndex].isBusy = true;
                result.dateReceive = new Date();
                result.mesRendezVous.push(rdvId);
                await this.medecinModel.updateOne({ _id:id }, result).then(res => next({ etat: true, result: result[jrChoice][horaireIndex].value })).catch(error => next({ etat: false, error }))
                    
              } else {
                next({ etat: false, error: new Error('Medecin introuvable') });
              }
            })
            .catch(error => next({ etat: false, error }));
        });
      }


      
      async getAllMedecin(): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.medecinModel
            .find()
            .populate('speciality')
            .then(result => {
              next({ etat: true, result })
            })
            .catch(error => next({ etat: false, error }));
        });
      }

      async getCountTotalMedecin() {
        return await this.medecinModel
          .find()
          .countDocuments()
          .exec();
      }


      async getAllMedecinByItem(item): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.medecinModel
            .find(item)
            .sort({dateReceive: -1 })
            .populate('speciality')
            .then(result => {
              next({ etat: true, result })
            })
            .catch(error => next({ etat: false, error }));
        });
      }

      async getAllMedecinInWait(): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.medecinModel
            .find({validateByAdmin: false})
            .sort({dateReceive: -1 })
            .populate('speciality')
            .then(result => {
              next({ etat: true, result })
            })
            .catch(error => next({ etat: false, error }));
        });
      }


      async getMedecinByItem(item): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.medecinModel
            .findOne(item)
            .populate('speciality')
            .then(result => {
              if(result) {
                next({ etat: true, result });
              } else {
                next({ etat: false, error: new Error("Aucun medecin") })
              }
            })
            .catch(error => next({ etat: false, error }));
        });
      }

      async createMedecin(medecin: CreateMedecinDto, images: string): Promise<ReponseServiceGeneral> {
        const password = coreEncode(medecin.password, parseInt(process.env.CRYPTO_DIGEST, 10));
        const recovery = generateRecovery();
        const generate = generateEmploie();
        return new Promise(async next => {
            const newMedecin = new this.medecinModel({...medecin, password,recovery, images, firstDay: generate,secondDay: generate, thirdDay: generate, fourDay: generate, fiveDay: generate, sixDay: generate, sevenDay: generate});
          await newMedecin.save()
            .then(async result => {
                next({ etat: true, result: {id: result._id, level: 2, validateByAdmin: result.validateByAdmin } })
            })
            .catch(error => {
              next({ etat: false, error })
            });
        });
      }

      async verifyMedecin(info: LoginDto): Promise<ReponseServiceGeneral> {
        const password = coreEncode(info.password, parseInt(process.env.CRYPTO_DIGEST, 10));
        return new Promise(async next => {
          await this.medecinModel
            .findOne({ email: info.email.trim(), password })
            .then(async result => {
              if (result) {
                  result.loginDate = new Date();
                  await result.save().then((updateMedecin)=> {
                    next({ etat: true, result: {id: result._id, level: 2, validateByAdmin: result.validateByAdmin, typeMedecin: result.typeMedecin} })
                  }).catch(error => next({ etat: false, error }))
              }else {
                next({ etat: false, error: new Error('Email ou Mot de passe incorrect') });
              }
            })
            .catch(error => next({ etat: false, error }));
        });
      }
}
