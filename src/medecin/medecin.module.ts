import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedecinController } from './medecin.controller';
import { MedecinSchema } from './medecin.schema';
import { MedecinService } from './medecin.service';
import { ClientModule } from '../client/client.module';
import { allSchema } from 'src/common/constants/schema';
import { AdminService } from 'src/admin/admin.service';

@Module({
  imports: [
    ClientModule,
    MongooseModule.forFeature(allSchema),],
  controllers: [MedecinController],
  providers: [MedecinService, AdminService],
  exports: [MedecinService],
})
export class MedecinModule {}
