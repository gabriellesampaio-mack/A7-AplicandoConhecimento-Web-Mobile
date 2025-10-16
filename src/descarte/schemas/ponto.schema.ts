import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'pontos' })
export class Ponto {
  @Prop({ required: true })
  nomeLocal: string;

  @Prop({ required: true })
  bairro: string;

  @Prop({ required: true, enum: ['publico', 'privado'] })
  tipoLocal: 'publico' | 'privado';

  @Prop({ type: [String], default: [] })
  categoriasAceitas: string[];

  @Prop({ type: { lat: Number, lng: Number }, required: true })
  geolocalizacao: { lat: number; lng: number };
}

export type PontoDocument = Ponto & Document;
export const PontoSchema = SchemaFactory.createForClass(Ponto);
