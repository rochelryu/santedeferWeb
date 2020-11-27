import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientModule } from 'src/client/client.module';
import { ClientService } from 'src/client/client.service';
import { allSchema } from 'src/common/constants/schema';
import { MedecinModule } from 'src/medecin/medecin.module';
import { MedecinService } from 'src/medecin/medecin.service';
import { AdminController } from './admin.controller';
import { AdminSchema } from './admin.schema';
import { AdminService } from './admin.service';
import { PathologieSchema, SpecialitySchema } from './model.schema';

@Module({
  imports: [
    MongooseModule.forFeature(allSchema),],
  controllers: [AdminController],
  providers: [AdminService, ClientService, MedecinService],
  exports: [AdminService],
})
export class AdminModule {}
