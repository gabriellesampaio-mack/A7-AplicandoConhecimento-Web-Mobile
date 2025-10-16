import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DescarteService } from './descarte.service';
import { DescarteController } from './descarte.controller';
import { Ponto, PontoSchema } from './schemas/ponto.schema';
import { Registro, RegistroSchema } from './schemas/registro.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ponto.name, schema: PontoSchema },
      { name: Registro.name, schema: RegistroSchema },
    ]),
  ],
  controllers: [DescarteController],
  providers: [DescarteService],
})
export class DescarteModule {}
