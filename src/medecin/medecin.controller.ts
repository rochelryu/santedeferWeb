import {
    Controller,
    Logger,
    Get,
    Param,
    HttpStatus,
    HttpException,
    Header,
    Post,
    Body,
    Request, Res, Query, UseInterceptors, UploadedFile,
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../common/functions/Globals';
import { diskStorage } from 'multer';
import { join } from 'path';

import { Response } from 'express';
import { LoginDto } from 'src/admin/admin.dto';
import { ClientService } from 'src/client/client.service';
import { UpdateEmploieDuTemps } from './medecin.dto';
import { MedecinService } from './medecin.service';
import { AdminService } from 'src/admin/admin.service';
import { CreateMedecinDto } from 'src/admin/admin.dto';
import { TypeMedecin } from './medecin.schema';

@Controller('medecin')
export class MedecinController {

    constructor(
        private readonly medecinService: MedecinService,
        private readonly clientService: ClientService,
        private readonly adminService: AdminService,
        ) {}


        private logger: Logger = new Logger('MedecinController');



        @Get()
        async indexAdmin(@Request() req, @Res() res: Response) {
          //   const newAdmin = await this.adminService.createAdmin({name: 'Santé de Fer', email: 'admin@santedefer.com',password: '01234567', numero: '01234567'});
          //   this.logger.log(newAdmin);
          
          if(req.session.sante && req.session.sante.level === 2) {
            const medecin = await this.medecinService.verifyMedecinById(req.session.sante.id);
            const rdvNumberForToday = await this.clientService.getCountRendezVousToDayForMedecin(req.session.sante.id);
            const rdvNumberDrop = await this.clientService.getCountRendezVousDropForMedecin(req.session.sante.id);
            const allRdvForTay = await this.clientService.getAllRendezVousToDayForMedecin(req.session.sante.id);
            const allRdvInWait= await this.clientService.getAllRendezVousForMedecinByStatus(req.session.sante.id, 1);
            const allRdvDone = await this.clientService.getAllRendezVousForMedecinByStatus(req.session.sante.id, 3);
            res
            .set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
            .render('indexMedecin', {
              title: 'Accueil Medecin',
              medecin: medecin.result,
              info: {rdvNumberForToday, rdvNumberDrop, allRdvForTay, allRdvInWait, allRdvDone}
            });
          } else {
            res.redirect('/')
          }
        }

    @Get('/viewRdv')
    async viewRdv(@Request() req, @Res() res: Response, @Query() query) {
      if(req.session.sante && req.session.sante.level === 2) {
        const medecin = await this.medecinService.verifyMedecinById(req.session.sante.id);
              const rendezVous = await this.clientService.getRendezVousByItem({_id: query.id});
              const allRendezVous = await this.clientService.getClientByItem({_id:rendezVous.result.client._id});
              
        // list medecin with number Of Medecin, create speciality and more vision of Medecin
        res
        .set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
        .render('suivieRdv', {
          title: 'Rendez Vous',
          medecin: medecin.result,
                info: {rendezVous:rendezVous.result,  allRendezVousTrueFormat: allRendezVous.result.mesRendezVous}
        });
        
      } else {
        res.redirect('/')
      }
    }
    @Get('/login')
    async loginMedecin(@Request() req, @Res() res: Response) {
    if(req.session.sante && req.session.sante.level === 2) {
        if(req.session.sante.validateByAdmin) {
          res.redirect('/medecin');
        } else {
          res.redirect('/medecin/inWait');
        }
    } else {
      const allSpeciality = await this.adminService.getAllSpeciality();
      const message = req.session.flash ?? '';
			req.session.destroy()
			res
      .set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
      .render('loginMedecin', {
				message,
				title: 'Authentification',
        info: {allSpeciality: allSpeciality.result}
			});
    }
    }

    @Get('/inWait')
    async inWait(@Request() req, @Res() res: Response) {
        res
        .set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
        .render('inWait', {
              title: 'En Attente',
            });
    }

    @Get('/doneWait')
    async doneWait(@Request() req, @Res() res: Response) {
        res
        .set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
        .render('doneWait', {
              title: 'Compte Confirmé',
            });
    }

    @Get('/logout')
	logout(@Request() req, @Res() res: Response) {
		req.session.destroy();
		res.redirect('/medecin/login');
	}



    @Get('/emploieDuTemps')
    async emploieDuTemps(@Request() req, @Res() res: Response) {
    if(req.session.sante && req.session.sante.level === 2) {
        const medecin = await this.medecinService.verifyMedecinById(req.session.sante.id);
            res
            .set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
            .render('medecinEmploieDuTemps', {
              title: 'Gestion Medecin',
              medecin: medecin.result,
            });
    } else {
      res.redirect('/medecin/login');
      }
    }

    @Get('/pathologie')
  async saveMedecin(@Request() req, @Res() res: Response) {
    if(req.session.sante && req.session.sante.level === 2) {
      const medecin = await this.medecinService.verifyMedecinById(req.session.sante.id);
      const allPathologie = await this.adminService.getAllPathologieBySpeciality(medecin.result.speciality);
      res
      .set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
      .render('pathologieMedecin', {
        title: 'Pathologie Medecin',
        medecin: medecin.result,
        info : {allPathologie: allPathologie.result}
			});
    } else {
       res.redirect('/')
    }
  }

    @Post('/login')
    async loginPostMedecin(@Request() req, @Res() res: Response, @Body() info: LoginDto) {
        const {etat, result, error} = await this.medecinService.verifyMedecin(info);
        if(etat) {
            req.session.sante = result;
            if(result.validateByAdmin && result.typeMedecin === TypeMedecin.MEDECIN_FULL){
              res.redirect('/medecin');
            } else if (result.validateByAdmin && result.typeMedecin !== TypeMedecin.MEDECIN_FULL) {
              res.redirect('/medecin/doneWait');
            }
            else {
              res.redirect('/medecin/inWait');
            }
        } else {
            req.session.flash = error.message;
            res.redirect('/medecin/login');
        }
        
    }

    @Post('/createMedecin')
  @UseInterceptors(FileInterceptor('images', {
    storage: diskStorage({
      destination: join(__dirname, '..', '..', 'public', 'assets', 'images','avatars', 'profils'),
      filename: editFileName,
    }),
    fileFilter: imageFileFilter
  }))
  async createMedecin(@Request() req, @Res() res: Response, @Body() medecinDto: CreateMedecinDto, @UploadedFile() file) {
    this.logger.debug(medecinDto);
      const image = file.filename;
      const newMedecin = await this.medecinService.createMedecin(medecinDto, image);
      this.logger.debug(newMedecin);
      if(newMedecin.etat) {
        res.redirect('/medecin/inWait')
      } else {
        res.redirect('/medecin/login')
      }
  }

    @Post('/createPathologie')
  async createPathologie(@Request() req, @Res() res: Response, @Body() pathologie: {name:string}) {
    if(req.session.sante && req.session.sante.level === 2) {
      const medecin = await this.medecinService.verifyMedecinById(req.session.sante.id);
      const createPathologie = await this.adminService.createPathologie(pathologie.name, medecin.result.speciality);
      res.redirect('/medecin/pathologie')
    } else {
      res.redirect('/');
    }
  }

  @Post('/verifyClient')
  async verifyClient(@Request() req, @Res() res: Response, @Body() body: {recovery:string}) {
    if(req.session.sante && req.session.sante.level === 2) {
      const client = await this.clientService.getClientByItem({recovery:body.recovery});
      if(client.etat){
        res.redirect(`/medecin/viewClient?recovery=${body.recovery}`);
      } else {
        res.json({etat:client.etat, error: 'Vous n\'êtes pas autorisé à voir cet patient'})
      }
      
    } else {
      res.redirect('/');
    }
  }
  @Get('/viewClient')
    async viewClient(@Request() req, @Res() res: Response, @Query() query: {recovery:string}) {
      if(req.session.sante && req.session.sante.level === 2) {
        const medecin = await this.medecinService.verifyMedecinById(req.session.sante.id);
              const client = await this.clientService.getClientByItem({recovery: query.recovery});
              const clientInfo = client.result;
              clientInfo.rendezVousInfo = [];
              for(let i = 0; i < client.result.mesRendezVous.length; i++) {
                const rendezVousInfo = await this.clientService.getRendezVousByItem({_id: client.result.mesRendezVous[i]._id});
                clientInfo.rendezVousInfo.push(rendezVousInfo.result);
              }
        res
        .set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
        .render('viewClient', {
          title: 'Voir le Carnet',
          medecin: medecin.result,
                info: {clientInfo}
        });
        
      } else {
        res.redirect('/')
      }
    }

    @Post('/emploieDuTemps')
    async emploieDuTempsPost(@Request() req, @Res() res: Response, @Body() info: UpdateEmploieDuTemps) {
      if(req.session.sante && req.session.sante.level === 2) {
        const updateEmploieDuTemps = await this.medecinService.updateEmploieDuTempsMedecinById(req.session.sante.id, info);
        res.redirect('/medecin/emploieDuTemps');
      } else {
        res.redirect('/medecin/login');
      }
        
    }

    @Post('/updateMedecinForActivate')
    async updateMedecinForActivate(@Request() req) {
      if(req.session.sante && req.session.sante.level === 2) {
        const {etat, error} = await this.medecinService.updateMedecinForActivate(req.session.sante.id);
        if(etat) {
          return {etat}
        } else {
          return {etat, error: error.message}
        }
      } else {
        return {etat: false, error: "Non authorisé"}
      }
        
    }
}
