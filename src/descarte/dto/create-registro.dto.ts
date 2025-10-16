import { IsString, IsMongoId, IsIn, IsOptional, IsDateString } from 'class-validator';

export class CreateRegistroDto {
  @IsString()
  nomeUsuario: string;

  @IsMongoId()
  pontoId: string;

  @IsIn(['plastico', 'papel', 'organico', 'eletronico', 'vidro'])
  tipoResiduo: 'plastico' | 'papel' | 'organico' | 'eletronico' | 'vidro';

  @IsOptional()
  @IsDateString()
  data?: string;
}
