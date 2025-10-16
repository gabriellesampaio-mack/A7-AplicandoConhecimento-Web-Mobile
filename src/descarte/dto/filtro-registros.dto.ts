import { IsOptional, IsMongoId, IsIn, IsString, IsDateString } from 'class-validator';

export class FiltroRegistrosDto {
  @IsOptional() @IsMongoId() pontoId?: string;
  @IsOptional() @IsIn(['plastico','papel','organico','eletronico','vidro']) tipoResiduo?: string;
  @IsOptional() @IsString() nomeUsuario?: string;
  @IsOptional() @IsDateString() dataInicio?: string;
  @IsOptional() @IsDateString() dataFim?: string;
}
