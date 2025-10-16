import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ponto, PontoDocument } from './schemas/ponto.schema';
import { Registro, RegistroDocument } from './schemas/registro.schema';
import { CreatePontoDto } from './dto/create-ponto.dto';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { FiltroRegistrosDto } from './dto/filtro-registros.dto';

@Injectable()
export class DescarteService {
  constructor(
    @InjectModel(Ponto.name) private readonly pontoModel: Model<PontoDocument>,
    @InjectModel(Registro.name) private readonly registroModel: Model<RegistroDocument>,
  ) {}

  async criarPonto(dto: CreatePontoDto) {
    return this.pontoModel.create(dto);
  }

  async listarPontos() {
    return this.pontoModel.find().lean();
  }

  async registrarDescarte(dto: CreateRegistroDto) {
    const ponto = await this.pontoModel.findById(dto.pontoId);
    if (!ponto) throw new NotFoundException('Ponto de descarte não encontrado');

    const payload: any = {
      nomeUsuario: dto.nomeUsuario,
      pontoId: new Types.ObjectId(dto.pontoId),
      tipoResiduo: dto.tipoResiduo,
      data: dto.data ? new Date(dto.data) : new Date(),
    };
    return this.registroModel.create(payload);
  }

  async consultarRegistros(f: FiltroRegistrosDto) {
    const query: any = {};
    if (f.pontoId) query.pontoId = new Types.ObjectId(f.pontoId);
    if (f.tipoResiduo) query.tipoResiduo = f.tipoResiduo;
    if (f.nomeUsuario) query.nomeUsuario = new RegExp(`^${f.nomeUsuario}$`, 'i');

    if (f.dataInicio || f.dataFim) {
      query.data = {};
      if (f.dataInicio) query.data.$gte = new Date(f.dataInicio);
      if (f.dataFim)   query.data.$lte = new Date(f.dataFim);
    }

    return this.registroModel.find(query).lean();
  }

  async relatorio() {
    const agora = new Date();
    const inicioJanela = new Date(agora);
    inicioJanela.setDate(inicioJanela.getDate() - 30);

    const inicioJanelaAnterior = new Date(inicioJanela);
    inicioJanelaAnterior.setDate(inicioJanelaAnterior.getDate() - 30);

    const topLocalAgg = await this.registroModel.aggregate([
      { $group: { _id: '$pontoId', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);

    let localTop: any = null;
    if (topLocalAgg[0]) {
      const ponto = await this.pontoModel.findById(topLocalAgg[0]._id).lean();
      localTop = ponto ? { pontoId: ponto._id, nomeLocal: ponto.nomeLocal, total: topLocalAgg[0].total } : null;
    }

    const tipoTopAgg = await this.registroModel.aggregate([
      { $group: { _id: '$tipoResiduo', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);
    const tipoMaisFrequente = tipoTopAgg[0] ? { tipoResiduo: tipoTopAgg[0]._id, total: tipoTopAgg[0].total } : null;

    const ultimos30Agg = await this.registroModel.aggregate([
      { $match: { data: { $gte: inicioJanela, $lte: agora } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$data' } }, total: { $sum: 1 } } },
    ]);
    const totalUltimos30 = ultimos30Agg.reduce((acc, d) => acc + d.total, 0);
    const mediaPorDia30 = totalUltimos30 / 30;

    const totalUsuarios = (await this.registroModel.distinct('nomeUsuario')).length;
    const totalPontos = await this.pontoModel.countDocuments();

    const periodoAnteriorAgg = await this.registroModel.aggregate([
      { $match: { data: { $gte: inicioJanelaAnterior, $lt: inicioJanela } } },
      { $count: 'total' },
    ]);
    const totalAnterior = periodoAnteriorAgg[0]?.total || 0;
    const crescimentoPercentual = totalAnterior == 0 ? (totalUltimos30 > 0 ? 100 : 0) : ((totalUltimos30 - totalAnterior) / totalAnterior) * 100;

    return {
      localComMaisRegistros: localTop,
      tipoResiduoMaisFrequente: tipoMaisFrequente,
      mediaDescartesPorDia30d: Number(mediaPorDia30.toFixed(2)),
      totalUsuarios,
      totalPontos,
      variacaoVolume30d_vs_30dAnterior_percent: Number(crescimentoPercentual.toFixed(2)),
      periodoAtual: { inicio: inicioJanela.toISOString(), fim: agora.toISOString(), total: totalUltimos30 },
      periodoAnterior: { inicio: inicioJanelaAnterior.toISOString(), fim: inicioJanela.toISOString(), total: totalAnterior },
    };
  }
}
