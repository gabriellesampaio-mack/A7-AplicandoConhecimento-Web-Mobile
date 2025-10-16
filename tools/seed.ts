import { connect, disconnect, model, Types } from 'mongoose';
import { Ponto, PontoSchema } from '../src/descarte/schemas/ponto.schema';
import { Registro, RegistroSchema } from '../src/descarte/schemas/registro.schema';

async function run() {
  const uri = process.env.MONGO_URI || '';
  if (!uri) {
    console.error('Defina MONGO_URI no .env para usar o seed');
    process.exit(1);
  }
  await connect(uri);

  const PontoModel = model<Ponto>('Ponto', PontoSchema);
  const RegistroModel = model<Registro>('Registro', RegistroSchema);

  const ponto = await PontoModel.create({
    nomeLocal: 'Ponto Central',
    bairro: 'Centro',
    tipoLocal: 'publico',
    categoriasAceitas: ['plastico','papel','vidro'],
    geolocalizacao: { lat: -23.55, lng: -46.63 },
  });

  await RegistroModel.create([
    { nomeUsuario: 'Gabi',  pontoId: ponto._id as Types.ObjectId, tipoResiduo: 'plastico',  data: new Date() },
    { nomeUsuario: 'Gabi',  pontoId: ponto._id as Types.ObjectId, tipoResiduo: 'papel',     data: new Date() },
    { nomeUsuario: 'Bruno', pontoId: ponto._id as Types.ObjectId, tipoResiduo: 'plastico',  data: new Date() },
  ]);

  console.log('Seed concluído.');
  await disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
