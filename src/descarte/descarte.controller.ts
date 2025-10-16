import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DescarteService } from './descarte.service';
import { CreatePontoDto } from './dto/create-ponto.dto';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { FiltroRegistrosDto } from './dto/filtro-registros.dto';

@Controller()
export class DescarteController {
  constructor(private readonly service: DescarteService) {}

  @Post('descarte/pontos')
  criarPonto(@Body() dto: CreatePontoDto) {
    return this.service.criarPonto(dto);
  }

  @Get('descarte/pontos')
  listarPontos() {
    return this.service.listarPontos();
  }

  @Post('descarte/registros')
  registrar(@Body() dto: CreateRegistroDto) {
    return this.service.registrarDescarte(dto);
  }

  @Get('descarte/registros')
  consultar(@Query() q: FiltroRegistrosDto) {
    return this.service.consultarRegistros(q);
  }

  @Get('relatorio')
  relatorio() {
    return this.service.relatorio();
  }
}
