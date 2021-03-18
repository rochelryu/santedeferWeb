import {
    Controller,
    Logger,
    Get,
    Param,
    HttpStatus,
    HttpException,
    Post,
    Body,
    Request, Res, Query,
  } from '@nestjs/common';
  import { Response } from 'express';
import { AdminService } from 'src/admin/admin.service';
import { MedecinService } from 'src/medecin/medecin.service';
import { CreateClientDto, LoginClientDto, QueryHeaderClientDto, QueryHeaderClientForGetRendezVousDto, QueryHeaderClientSearchMedecinDto, CreateRendezVousFirstStepDTO,CreateRendezVousLastStepDTO, CreateAntecedentDto, ChangeProfilPictureDto, CreateRendezVousFinalDTO,UpdateRendezVousFinalDTO } from './client.dto';
import { addDays, getDay } from 'date-fns';
import { ClientService } from './client.service';
import { generateRecovery, getArrayDayOfMedecinRendezVous } from 'src/common/functions/Globals';
import { TypeMedecin } from 'src/medecin/medecin.schema';


@Controller('client')
export class ClientController {
    constructor(
      private readonly clientService: ClientService,
      private readonly adminService: AdminService,
      private readonly medecinService: MedecinService,
      ) {}

  private logger: Logger = new Logger('ClientController');

  @Get('/getAllPathologie')
    async getAllPathologie(@Request() req, @Res() res: Response) {
      const allPathologie = await this.adminService.getAllSpeciality();
      res.json({allPathologie: allPathologie.result});
    }


    @Get('/getAllConseils')
    async getAllConseils(@Request() req, @Res() res: Response) {
      const between3At11 = await this.adminService.getAllConseilsByType(1);
      const between12At21 = await this.adminService.getAllConseilsByType(2);
      const between22At40 = await this.adminService.getAllConseilsByType(3);
      const after40 = await this.adminService.getAllConseilsByType(4);
      const info = {
        between3At11 : between3At11.result,
        between12At21 : between12At21.result,
        between22At40 : between22At40.result,
        after40 : after40.result,
      }
      res.json(info);
    }


  @Get('/getProfil')
  async getProfil(@Request() req, @Res() res: Response, @Query() query: QueryHeaderClientDto) {
      const user = await this.clientService.getClientByItem(query);
      if(user.etat){
        const result = user.result;
        const allRendezVousTrueFormat = [];
        for(let i = 0; i < user.result.mesRendezVous.length; i++) {
              const medecinTraitant = await this.medecinService.getMedecinByItem({_id: user.result.mesRendezVous[i].medecinTraitant});
              const rendezVousInfo = await this.clientService.getRendezVousByItem({_id: user.result.mesRendezVous[i]._id});
              allRendezVousTrueFormat.push({isDone: rendezVousInfo.result.isDone,description: rendezVousInfo.result.description,diagnostic: rendezVousInfo.result.diagnostic,automedication: rendezVousInfo.result.automedication,traitement: rendezVousInfo.result.traitement,_id:rendezVousInfo.result._id,
                dateDuRendezVous: user.result.mesRendezVous[i].dateDuRendezVous, lieuDuRendezVous: user.result.mesRendezVous[i].lieuDuRendezVous, medecinTraitantName: medecinTraitant.etat ? medecinTraitant.result.name : '',medecinTraitantNumero: medecinTraitant.etat ? medecinTraitant.result.numero : '', mdedecinSpecialist: rendezVousInfo.result.speciality.name, mdedecinImages: medecinTraitant.etat ? medecinTraitant.result.images : ''})
            }
        res.json({etat: user.etat, result, allRendezVousTrueFormat: allRendezVousTrueFormat.reverse()});
      } else {
        res.json({etat: user.etat, error: user.error.message});
      }
      
  }

  @Get('/getMyMedecin')
  async getMyMedecin(@Request() req, @Res() res: Response, @Query() query: QueryHeaderClientDto) {
      const user = await this.clientService.getClientByItem(query);
      if(user.etat){
        const result = user.result;
        const allMedecinTrueFormat = [];
        for(let i = 0; i < user.result.listMedecin.length; i++) {
              const medecinTraitant = await this.medecinService.getMedecinByItem({_id: user.result.listMedecin[i]});
              allMedecinTrueFormat.push({name: medecinTraitant.result.name, _id: medecinTraitant.result._id})
            }
        res.json({etat: user.etat, allMedecinTrueFormat: allMedecinTrueFormat.reverse()});
      } else {
        res.json({etat: user.etat, error: user.error.message});
      }
      
  }

  @Get('/getRendezVous')
  async getRendezVous(@Request() req, @Res() res: Response, @Query() query: QueryHeaderClientForGetRendezVousDto) {
    const {_id, recovery} = query;
      const user = await this.clientService.getClientByItem({_id, recovery});
      if(user.etat){
        const rendezVousInfo = await this.clientService.getRendezVousByItem({_id: query.rendezVousId})
        res.json(rendezVousInfo);
      } else {
        res.json({etat: user.etat, error: user.error.message});
      }
      
  }  
  
  
  @Get('/getSearch')
  async getSearch(@Request() req, @Res() res: Response, @Query() query: QueryHeaderClientSearchMedecinDto) {
    const {_id, recovery, ...rest} = query;
      const user = await this.clientService.getClientByItem({_id, recovery});
      if(user.etat){
        const allPersonnels = rest.typeMedecin === TypeMedecin.INFIRMIER ? await this.medecinService.getAllMedecinByItem({address: rest.address, typeMedecin: rest.typeMedecin, validateByAdmin: true}): await this.medecinService.getAllMedecinByItem({address: rest.address, speciality: rest.speciality, typeMedecin: rest.typeMedecin, validateByAdmin: true});
        res.json(allPersonnels.result);
      } else {
        res.json([]);
      }
      
    }

  @Post('/login')
  async loginPostClient(@Body() loginClient: LoginClientDto) {
      const {etat, result, error} = await this.clientService.verifyClient(loginClient);
      if(etat) {
        return {etat, result};
      } else {
        return {etat, error: error.message};
      }
    
  }

  @Post('/createAntecedent')
  async createAntecedent(@Request() req, @Res() res: Response,@Body() requestClient: CreateAntecedentDto) {
      const {_id, recovery, ...rest} = requestClient;
      const user = await this.clientService.getClientByItem({_id, recovery});
      if(user.etat){
        
        const updateClient =  await this.clientService.updateClientForAntecedent(_id, rest.antecedent);
        res.json(updateClient);
      } else {
        res.json({etat: user.etat, error: user.error.message});
      }
    
  }

  @Post('/createRendezVousStandard')
  async createRendezVousStandard( @Res() res: Response, @Body() info: CreateRendezVousFirstStepDTO) {
      //const {etat, result, error} = await this.clientService.verifyClient(loginClient);
      //const numberDate = getDay(new Date());
      const client = await this.clientService.getClientByItem({_id: info.id});
        if(client.etat) {
          const medecinsSpecificInTheArea = await this.medecinService.getAllMedecinByItem({address:info.address, speciality:info.speciality, isActivate:true})
          if(medecinsSpecificInTheArea.etat && medecinsSpecificInTheArea.result.length > 0) {
            const newRendezVous = await this.clientService.createRendezVousFirstEtape(info);
            if(newRendezVous.etat) {
              res.json({etat: true, result: { medecin: medecinsSpecificInTheArea.result, rendezVous: newRendezVous.result}});
            } else {
              res.json({etat: false, error:'Un Problème de communication avec le serveur veuillez ressayer plutard'});
            }
          } else {
            res.json({etat: false, error:'Désolé, nous n\'avons pas encore de medecin disponible dans votre zone, veuillez patienter.'});
          }
        } else {
          res.json({etat: false, error:client.error.message});
        }
    
  }

  @Post('/finaliserRendezVousStandard')
  async finaliserRendezVousStandard( @Res() res: Response, @Body() info: CreateRendezVousLastStepDTO) {
      //const {etat, result, error} = await this.clientService.verifyClient(loginClient);
      const moment = new Date();
        const numberDateWithoutZeroIndex = getDay(moment);
        this.logger.log(info);
        const client = await this.clientService.getClientByItem({_id: info.id});
        const rendezvous = await this.clientService.getRendezVousByItem({_id: info.rdvId, client: info.id});
        
        if(client.etat && rendezvous.etat) {
          const dayForChoice = parseInt(info.numberDay,10);
          const horaireIndex = parseInt(info.horaireIndex,10);
          const jrChoice = getArrayDayOfMedecinRendezVous(dayForChoice);
          const numberDate = numberDateWithoutZeroIndex - 1;
          const numberAddDay = (dayForChoice - numberDate) >= 0 ? dayForChoice - numberDate : 7 - numberDate + dayForChoice;
          
          const medecin = await this.medecinService.getMedecinByItem({_id: info.medecinTraitant});
          
          if(medecin.etat && !medecin.result[jrChoice][horaireIndex].isBusy){
            const date = addDays(new Date(moment.getFullYear(), moment.getMonth(), moment.getDate(), horaireIndex + 7), numberAddDay);
            const updateMedecin = await this.medecinService.updateMedecinForRdv(info.medecinTraitant, jrChoice, horaireIndex, info.rdvId);
            const updateClient = await this.clientService.updateClientForRdv(info.id, info.rdvId, info.medecinTraitant);
            const updateRendezVous = await this.clientService.updateRdv(info.rdvId, {lieuDuRendezVous: updateMedecin.result, dateDuRendezVous: date, medecinTraitant: info.medecinTraitant, isDone: 1});
            res.json({etat: true, result:{date, lieu: updateMedecin.result,medecin: medecin.result.name }});
          } else {
            res.json({etat: false, error:"Ce moment est déjà pris par un autre patient à l'instant"});
          }
          
          // const newRendezVous = await this.clientService.createRendezVousFirstEtape(info);addDay
        } else {
          res.json({etat: false, error:"Vous n'ètes pas authorisé"});
        }

    
  }
  @Post('changeProfil')
  async changeProfil(@Body() client: ChangeProfilPictureDto) {

      return await this.clientService.updateChangeProfil(
        client._id,
        client.image,
        client.base64,
      );
  }

  @Post('createRendezVousByUserAfterConsultation')
  async createRendezVousByUserAfterConsultation(@Body() clientCreateRendezVousFinalDTO: CreateRendezVousFinalDTO) {
      const newRdv = await this.clientService.createRendezVousByUserAfterConsultation(clientCreateRendezVousFinalDTO);
      if(newRdv.etat) {
        
        await this.clientService.updateClientRendezVous(clientCreateRendezVousFinalDTO.id, newRdv.result._id);
        return {etat: newRdv.etat};
      } else {
        return {etat: false};
      }
  }

  @Post('updateRendezVousByUserAfterConsultation')
  async updateRendezVousByUserAfterConsultation(@Body() clientUpdateRendezVousFinalDTO: UpdateRendezVousFinalDTO) {
      const newRdv = await this.clientService.updateRendezVousByUserAfterConsultation(clientUpdateRendezVousFinalDTO);
      return {etat: newRdv.etat};
  }

  @Post('/signup')
  async signupPostClient(@Body() createClient: CreateClientDto) {
      const {etat, result, error} = await this.clientService.createClient(createClient);
      if(etat) {
        return {etat, result};
      } else {
        return {etat, error: error.message};
      }
    
  }
}

  
