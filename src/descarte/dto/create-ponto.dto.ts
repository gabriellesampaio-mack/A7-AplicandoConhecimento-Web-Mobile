import { IsString, IsIn, IsArray, ArrayNotEmpty, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class GeoDTO {
  @IsNumber() lat: number;
  @IsNumber() lng: number;
}

export class CreatePontoDto {
  @IsString() nomeLocal: string;
  @IsString() bairro: string;

  @IsIn(['publico', 'privado'])
  tipoLocal: 'publico' | 'privado';

  @IsArray()
  @ArrayNotEmpty()
  categoriasAceitas: string[];

  @ValidateNested()
  @Type(() => GeoDTO)
  geolocalizacao: GeoDTO;
}
