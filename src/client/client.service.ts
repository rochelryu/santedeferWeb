import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { coreEncode } from 'crypto-core';
import { Model } from 'mongoose';
import { generateRecovery, createFileWithBuffer, deleteFilesWithListName } from 'src/common/functions/Globals';
import { ReponseServiceGeneral } from 'src/common/interfaces/response.interfaces';
import { CreateClientDto, LoginClientDto, CreateRendezVousFirstStepDTO, CreateRendezVousLastStepDTO, CreateRendezVousFinalDTO,UpdateRendezVousFinalDTO } from './client.dto';
import { ClientInterface, RendezVousInterface } from './client.schema';

@Injectable()
export class ClientService {

    constructor(
        @InjectModel('Client') private readonly clientModel: Model<ClientInterface>,
        @InjectModel('RendezVous') private readonly rendezVousModel: Model<RendezVousInterface>,
      ) {}
      async verifyClient(info: LoginClientDto): Promise<ReponseServiceGeneral> {
        const password = coreEncode(info.password, parseInt(process.env.CRYPTO_DIGEST, 10));
        return new Promise(async next => {
          await this.clientModel
            .findOne({ numero: info.numero.trim(), password })
            .then(async result => {
              if (result) {
                  result.loginDate = new Date();
                  result.recovery = generateRecovery()
                  await result.save().then((updateClient)=> {
                    const {name, _id, numero, prefix, images, recovery, address, email, wallet} = result;
                    next({ etat: true, result: {name, _id, numero, prefix, images, recovery, address, email, wallet} })
                  }).catch(error => next({ etat: false, error: new Error('Probleme avec le serveur') }))
              }else {
                next({ etat: false, error: new Error('Numero ou Mot de passe incorrect') });
              }
            })
            .catch(error => next({ etat: false, error: new Error('Probleme avec le serveur') }));
        });
      }

      async createClient(createClient: CreateClientDto): Promise<ReponseServiceGeneral> {
        const password = coreEncode(createClient.password, parseInt(process.env.CRYPTO_DIGEST, 10));
        const recovery = generateRecovery();
        const birthDate = new Date(createClient.birthDate);
        return new Promise(async next => {
            await this.clientModel.findOne({numero: createClient.numero})
            .then(async result => {
                if(result) {
                    next({ etat: false, error: new Error('Ce numero appartient déjà à un autre compte') })
                }
                else {
                    const newAdmin = new this.clientModel({...createClient, password,recovery, birthDate});
                    await newAdmin.save()
                    .then(async result => {
                      const {name, _id, numero, prefix, images, recovery, address, email, wallet} = result;
                        next({ etat: true, result: {name, _id, numero, prefix, images, recovery, address, email, wallet} })
                    })
                    .catch(error => next({ etat: false, error: new Error('Probleme avec le serveur') }));
                }

            }).catch(error => next({ etat: false, error }));
        });
      }


      async getCountTotalClient() {
        return await this.clientModel
          .find()
          .countDocuments()
          .exec();
      }


      async getCountNewClientToDay() {
        const momentDay = new Date();
        return await this.clientModel
          .find({registerDate: {
              $gte: new Date(momentDay.getFullYear(), momentDay.getMonth(), momentDay.getDate()),
            },})
          .countDocuments()
          .exec();
      }

      



      async getClientByItem(item): Promise<ReponseServiceGeneral> {
        
        return new Promise(async next => {
            await this.clientModel.findOne(item)
            .populate('mesRendezVous')
            .then(async result => {
                if(result) {
                        next({ etat: true, result })
                    
                }
                else {
                  next({ etat: false, error: new Error('Authentification échoué') })
                }

            })
            .catch(error => next({ etat: false, error: new Error('Probleme avec le serveur') }));
        });
      }

      async updateClientForRdv(id: string, rdvId: string, medecinId:string): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.clientModel
            .findOne({ _id:id })
            .then(async result => {
              if (result) {
                
                result.mesRendezVous.push(rdvId);
                if(!result.listMedecin.includes(medecinId)){
                  result.listMedecin.push(medecinId);
                } 
                await this.clientModel.updateOne({ _id:id }, result).then(res => next({ etat: true, result })).catch(error => next({ etat: false, error }))
                    
              } else {
                next({ etat: false, error: new Error('Medecin introuvable') });
              }
            })
            .catch(error => next({ etat: false, error }));
        });
      }

      async updateChangeProfil(
    id: string,
    imageName: string,
    base64: string,
  ): Promise<ReponseServiceGeneral> {
    return new Promise(async next => {
      const client = await this.clientModel.findOne({ _id: id }).exec();
      deleteFilesWithListName([`profilClients/${client.images}`]);
      const nameImage = `${
        client.name
      } _ ${generateRecovery()} _ ${imageName}`;
      createFileWithBuffer(`profilClients/${nameImage}`, base64);
      client.images = nameImage;
      await client
        .save()
        .then(result => {
          next({ etat: true, result });
        })
        .catch(error => next({ etat: false, error }));
    });
  }
  
      async updateClientForAntecedent(id: string, antecedent:string): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.clientModel
            .findOne({ _id:id })
            .then(async result => {
              if (result) {
                
                if(!result.antecedent.includes(antecedent)){
                  result.antecedent.push(antecedent);
                } 
                await this.clientModel.updateOne({ _id:id }, result).then(res => next({ etat: true, result })).catch(error => next({ etat: false, error }))
                    
              } else {
                next({ etat: false, error: new Error('Client introuvable') });
              }
            })
            .catch(error => next({ etat: false, error }));
        });
      }
      async updateClientRendezVous(id: string, idRendezVous:string): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.clientModel
            .findOne({ _id:id })
            .then(async result => {
              if (result) {
                
                if(!result.mesRendezVous.includes(idRendezVous)){
                  result.mesRendezVous.push(idRendezVous);
                } 
                await this.clientModel.updateOne({ _id:id }, result).then(res => next({ etat: true, result })).catch(error => next({ etat: false, error }))
                    
              } else {
                next({ etat: false, error: new Error('Client introuvable') });
              }
            })
            .catch(error => next({ etat: false, error }));
        });
      }


      async updateRdv(id: string, result): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.rendezVousModel.updateOne({ _id:id }, result).then(res => next({ etat: true, result:res })).catch(error => next({ etat: false, error }))
        });
      }

      async getCountTotalRdv() {
        return await this.rendezVousModel
          .find()
          .countDocuments()
          .exec();
      }

      async getCountRendezVousToDay(type: number) {
        const momentDay = new Date();
        return await this.rendezVousModel
          .find({$and: [
          { typeRdv: type },
          {
            dateDuRendezVous: {
              $gte: new Date(momentDay.getFullYear(), momentDay.getMonth(), momentDay.getDate()),
              $lt: new Date(momentDay.getFullYear(), momentDay.getMonth(), momentDay.getDate() + 1),
            },
          },
        ],})
          .countDocuments()
          .exec();
      }

      async getCountRendezVousToDayForMedecin(medecinid: string) {
        const momentDay = new Date();
        return await this.rendezVousModel
          .find({$and: [
          { medecinTraitant: medecinid },
          {
            dateDuRendezVous: {
              $gte: new Date(momentDay.getFullYear(), momentDay.getMonth(), momentDay.getDate()),
              $lt: new Date(momentDay.getFullYear(), momentDay.getMonth(), momentDay.getDate() + 1),
            },
          },
        ],})
          .countDocuments()
          .exec();
      }

      async getAllRendezVousToDayForMedecin(medecinid: string) {
        const momentDay = new Date();
        return await this.rendezVousModel
          .find({$and: [
          { medecinTraitant: medecinid },
          {
            dateDuRendezVous: {
              $gte: new Date(momentDay.getFullYear(), momentDay.getMonth(), momentDay.getDate()),
              $lt: new Date(momentDay.getFullYear(), momentDay.getMonth(), momentDay.getDate() + 1),
            },
          },
        ],})
        .populate('client')
          .exec();
      }

      async getAllRendezVousForMedecinByStatus(medecinid: string, isDone: number) {
        const momentDay = new Date();
        return await this.rendezVousModel
          .find({$and: [
          { medecinTraitant: medecinid },
          {isDone},
        ],})
        .populate('client')
          .exec();
      }


      async getCountRendezVousDropForMedecin(medecinid: string) {
        const momentDay = new Date();
        return await this.rendezVousModel
          .find({$and: [
          { medecinTraitant: medecinid },
          {
            isDone:2,
          },
        ],})
          .countDocuments()
          .exec();
      }

      async getAllRendezVousToDay() {
        const momentDay = new Date();
        return await this.rendezVousModel
          .find({dateDuRendezVous: {
              $gte: new Date(momentDay.getFullYear(), momentDay.getMonth(), momentDay.getDate()),
              $lt: new Date(momentDay.getFullYear(), momentDay.getMonth(), momentDay.getDate() + 1),
            }})
            .populate('client')
            .populate('speciality')
          .exec();
      }


      


      async getAllClient(): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.clientModel
            .find()
            .then(result => {
              next({ etat: true, result })
            })
            .catch(error => next({ etat: false, error }));
        });
      }

      async getAllRendezVous(): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          await this.rendezVousModel
            .find()
            .populate('medecinTraitant')
            .populate('client')
            .populate('speciality')
            .then(result => {
              next({ etat: true, result })
            })
            .catch(error => next({ etat: false, error }));
        });
      }


      


      async getRendezVousByItem(item): Promise<ReponseServiceGeneral> {
        
        return new Promise(async next => {
            await this.rendezVousModel.findOne(item)
            .populate('client')
            .populate('speciality')
            .populate('medecinTraitant')
            .then(async result => {
                if(result) {
                        next({ etat: true, result })
                }
                else {
                  next({ etat: false, error: new Error('Ce Rendez Vous n\'existe pas') })
                }

            })
            .catch(error => next({ etat: false, error: new Error('Probleme avec le serveur') }));
        });
      }

      


      async createRendezVousFirstEtape(firstRendezVous: CreateRendezVousFirstStepDTO): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          const rendezVous = new this.rendezVousModel(
            {
              client: firstRendezVous.id,
              speciality: firstRendezVous.speciality,
              description: firstRendezVous.description
            });
          await rendezVous.save()
          .then(result => next({etat: true, result}))
          .catch(error => next({etat: false, error}))
        });
      }

      async createRendezVousByUserAfterConsultation(apresRendezVous: CreateRendezVousFinalDTO): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          const {id, imageName, base64,recovery, ...rest} = apresRendezVous;
          const client = await this.clientModel.findOne({ _id: id }).exec();
          const nameImage = `${
            client._id
          } _ ${generateRecovery()} _ ${imageName}`;
          createFileWithBuffer(`carnet_sante/${nameImage}`, base64);
          const dateDuRendezVous = new Date(apresRendezVous.dateDuRendezVous);
          const rendezVous = new this.rendezVousModel({...rest, client:id, dateDuRendezVous, isDone: 3, typeRdv: 3, traitement:nameImage});
          await rendezVous.save()
          .then(result => next({etat: true, result}))
          .catch(error => next({etat: false, error}))
        });
      }

      async updateRendezVousByUserAfterConsultation(apresRendezVous: UpdateRendezVousFinalDTO): Promise<ReponseServiceGeneral> {
        return new Promise(async next => {
          const {id, imageName, base64,recovery,rendezVousId, ...rest} = apresRendezVous;
          const client = await this.clientModel.findOne({ _id: id }).exec();
          const nameImage = `${
            client._id
          } _ ${generateRecovery()} _ ${imageName}`;
          createFileWithBuffer(`carnet_sante/${nameImage}`, base64);
          await this.rendezVousModel.updateOne({ _id:rendezVousId }, {...rest, isDone: 3,traitement:nameImage}).then(result => next({ etat: true, result })).catch(error => next({ etat: false, error }))
          
        });
      }

      // async finaliserRendezVousStandard(info: CreateRendezVousLastStepDTO): Promise<ReponseServiceGeneral> {
      //   return new Promise(async next => {
      //     await this.rendezVousModel
      //       .findOne({ _id: info.rdvId })
      //       .then(async result => {
      //         if (result) {
      //             result.medecinTraitant = info.medecinTraitant;
      //             await result.save().then((updateClient)=> {
      //               const {name, _id, numero, prefix, images, recovery, address, email, wallet} = result;
      //               next({ etat: true, result: {name, _id, numero, prefix, images, recovery, address, email, wallet} })
      //             }).catch(error => next({ etat: false, error: new Error('Probleme avec le serveur') }))
      //         }else {
      //           next({ etat: false, error: new Error('Numero ou Mot de passe incorrect') });
      //         }
      //       })
      //       .catch(error => next({ etat: false, error: new Error('Probleme avec le serveur') }));
      //   });
      // }
}
