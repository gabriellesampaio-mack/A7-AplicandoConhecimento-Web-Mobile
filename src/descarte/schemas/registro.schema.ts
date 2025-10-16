import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Ponto } from './ponto.schema';

@Schema({ timestamps: true, collection: 'registros' })
export class Registro {
  @Prop({ required: true })
  nomeUsuario: string;

  @Prop({ type: Types.ObjectId, ref: Ponto.name, required: true })
  pontoId: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['plastico', 'papel', 'organico', 'eletronico', 'vidro'],
  })
  tipoResiduo: 'plastico' | 'papel' | 'organico' | 'eletronico' | 'vidro';

  @Prop({ type: Date, default: Date.now })
  data: Date;
}

export type RegistroDocument = Registro & Document;
export const RegistroSchema = SchemaFactory.createForClass(Registro);
