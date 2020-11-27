import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ClientModule } from './client/client.module';
import { MedecinModule } from './medecin/medecin.module';


import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/santeDeFer', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }),AdminModule, MedecinModule, ClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
