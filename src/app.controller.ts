import { Controller, Get, Request, Res, } from '@nestjs/common';
import { AppService } from './app.service';
  import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async index(@Request() req, @Res() res: Response) {
      
      res.render('landing', {
        title: 'Accueil',
        
      });
    
  }
}
