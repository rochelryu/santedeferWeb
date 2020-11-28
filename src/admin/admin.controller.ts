import {
    Controller,
    Logger,
    Get,
    Param,
    HttpStatus,
    HttpException,
    Post,
    Body,
    Request, Res, Query, UseInterceptors, UploadedFile,
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
  import { Response } from 'express';
  import * as session from 'express-session';
import { CreateMedecinDto, LoginDto } from './admin.dto';
import { diskStorage } from 'multer';
import { AdminService } from './admin.service';
import { join } from 'path';
import { editFileName, imageFileFilter } from '../common/functions/Globals';
import { MedecinService } from '../medecin/medecin.service';
import { ClientService } from 'src/client/client.service';
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly medecinService: MedecinService,
    private readonly clientService: ClientService,
    ) {}

  private logger: Logger = new Logger('AdminController');

  @Get()
  async indexAdmin(@Request() req, @Res() res: Response) {
      //const newAdmin = await this.adminService.createAdmin({name: 'Santé de Fer', email: 'admin@santedefer.com',password: '01234567', numero: '01234567'});
    if(req.session.sante && req.session.sante.level === 3) {
      const user = await this.adminService.verifyAdminById(req.session.sante.id);
      const totalClient = await this.clientService.getCountTotalClient();
      const totalMedecin = await this.medecinService.getCountTotalMedecin();
      const newClient = await this.clientService.getCountNewClientToDay();
      const totalRdv = await this.clientService.getCountTotalRdv();
      const rdvStandardForToday = await this.clientService.getCountRendezVousToDay(0);
      const rdvFidelForToday = await this.clientService.getCountRendezVousToDay(0);
      const allRdvForToDay = await this.clientService.getAllRendezVousToDay()
      const info = {totalClient, newClient, totalRdv, rdvStandardForToday, rdvFidelForToday, totalMedecin, allRdvForToDay};
      res.render('index', {
        title: 'Accueil',
        user: user.result,
        info,
      });
    } else {
      res.redirect('/')
    }
  }


  @Get('/login')
  async loginAdmin(@Request() req, @Res() res: Response) {
    if(req.session.sante) {
        res.redirect('/admin');
    } else {
      const message = req.session.flash ?? '';
			req.session.destroy()
			res.render('loginAdmin', {
				message,
				title: 'Authentification'
			});
    }
  }

  @Get('/saveMedecin')
  async saveMedecin(@Request() req, @Res() res: Response) {
    if(req.session.sante) {
      const user = await this.adminService.verifyAdminById(req.session.sante.id)
      if(user.etat) {
      const allPathologie = await this.adminService.getAllPathologie();
      const allSpeciality = await this.adminService.getAllSpeciality();
      const allMedecin = await this.medecinService.getAllMedecin();

      const info = {allPathologie: allPathologie.result, allSpeciality: allSpeciality.result, allMedecin: allMedecin.result};
      // list medecin with number Of Medecin, create speciality and more vision of Medecin
			res.render('saveMedecin', {
        title: 'Medecin',
        user: user.result,
        info
			});
      } else {
        res.redirect('/admin/login')
      }
    } else {
       res.redirect('/')
    }
  }


  

  @Get('/logout')
	logout(@Request() req, @Res() res: Response) {
		req.session.destroy();
		res.redirect('/admin/login');
	}

  @Get('/listClient')
  async listClient(@Request() req, @Res() res: Response) {
    if(req.session.sante) {
      const user = await this.adminService.verifyAdminById(req.session.sante.id)
      if(user.etat) {
      const allClient = await this.clientService.getAllClient();
      

      const info = {allClient: allClient.result};
      // list medecin with number Of Medecin, create speciality and more vision of Medecin
			res.render('listClient', {
        title: 'Patient list',
        user: user.result,
        info
			});
      } else {
        res.redirect('/admin/login')
      }
    } else {
       res.redirect('/')
    }
  }

  @Get('/listRendezVous')
  async listRendezVous(@Request() req, @Res() res: Response) {
    if(req.session.sante) {
      const user = await this.adminService.verifyAdminById(req.session.sante.id)
      if(user.etat) {
      const allRendezVous = await this.clientService.getAllRendezVous();
      const info = {allClient: allRendezVous.result};
			res.render('listRendezVous', {
        title: 'Rendez Vous list',
        user: user.result,
        info
			});
      } else {
        res.redirect('/admin/login')
      }
    } else {
       res.redirect('/')
    }
  }

  @Get('/payeMedecin')
  async payeMedecin(@Request() req, @Res() res: Response) {
    if(req.session.sante) {
      const user = await this.adminService.verifyAdminById(req.session.sante.id)
      if(user.etat) {
      const allMedecin = await this.medecinService.getAllMedecinByItem({demandeRetrait: true});
      

      const info = {allMedecin: allMedecin.result};
      // list medecin with number Of Medecin, create speciality and more vision of Medecin
			res.render('payeMedecin', {
        title: 'Payement Medecin',
        user: user.result,
        info
			});
      } else {
        res.redirect('/admin/login')
      }
    } else {
       res.redirect('/')
    }
  }

  @Get('/getConseilsByType')
  async getConseilsByType(@Request() req, @Res() res: Response, @Query() query: {type:string}) {
    if(req.session.sante) {
      const user = await this.adminService.verifyAdminById(req.session.sante.id)
      if(user.etat) {
      const allConseils = await this.adminService.getAllConseilsByType(parseInt(query.type, 10));
      
      const info = {allConseils: allConseils.result, type: parseInt(query.type, 10)};
      this.logger.log(info);
      // list medecin with number Of Medecin, create speciality and more vision of Medecin
			res.render('listConseils', {
        title: 'List Conseils',
        user: user.result,
        info
			});
      } else {
        res.redirect('/admin/login')
      }
    } else {
       res.redirect('/')
    }
  }

  @Get('/pathologie')
  async pathologie(@Request() req, @Res() res: Response) {
    if(req.session.sante) {
      // create pathologie and attribute speciality
			res.render('pathologie', {
				title: 'Pathologie'
			});
    } else {
       res.redirect('/admin/login')
    }
  }

  

  @Post('/login')
  async loginPostAdmin(@Request() req, @Res() res: Response, @Body() info: LoginDto) {
      const {etat, result, error} = await this.adminService.verifyAdmin(info);
      if(etat) {
        req.session.sante = result;
        res.redirect('/admin');
      } else {
        req.session.flash = error.message;
        res.redirect('/admin/login');
      }
    
  }

  @Post('/createConseils')
  async createConseils(@Request() req, @Res() res: Response, @Body() conseil: {title:string, type:string, content:string}) {
    if(req.session.sante && req.session.sante.level === 3) {
      const createConseil = await this.adminService.createConseil(conseil.title,parseInt(conseil.type, 10), conseil.content);
      res.redirect(`/admin/getConseilsByType?type=${conseil.type}`);
    } else {
      res.redirect('/');
    }
  }


  @Post('/createSpeciality')
  async createSpeciality(@Request() req, @Res() res: Response, @Body() speciality: {name:string}) {
    if(req.session.sante && req.session.sante.level === 3) {
      const createSpeciality = await this.adminService.createSpeciality(speciality.name);
      res.redirect('/admin/saveMedecin');
    } else {
      res.redirect('/');
    }
  }

  @Post('/createPathologie')
  async createPathologie(@Request() req, @Res() res: Response, @Body() pathologie: {name:string, speciality: string}) {
    if(req.session.sante && req.session.sante.level === 3) {
      const createPathologie = await this.adminService.createPathologie(pathologie.name, pathologie.speciality);
      res.redirect('/admin/saveMedecin')
    } else {
      res.redirect('/');
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
    if(req.session.sante && req.session.sante.level === 3) {
      const image = file.filename;
      this.logger.log(image);
      const newMedecin = await this.medecinService.createMedecin(medecinDto, image);
      res.redirect('/admin/saveMedecin');
    } else {
      res.redirect('/');
    }
  }
}
