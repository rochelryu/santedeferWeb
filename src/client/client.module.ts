import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientSchema, RendezVousSchema } from './client.schema';
import { MedecinService } from 'src/medecin/medecin.service';
import { AdminService } from 'src/admin/admin.service';
import { AdminModule } from 'src/admin/admin.module';
import { allSchema } from 'src/common/constants/schema';

@Module({
  imports: [
    
  MongooseModule.forFeature(allSchema),
  ],
  controllers: [ClientController],
  providers: [ClientService, AdminService, MedecinService],
  exports: [ClientService],
})
export class ClientModule {}
