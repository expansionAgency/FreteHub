import UsuarioModel from './Usuario';
import EmbarcadorModel from './Embarcador';
import TransportadorModel from './Transportador';
import EnderecoModel from './Endereco';
import VeiculoModel from './Veiculo';
import CargaModel from './Carga';
import OfertaModel from './Oferta';

// Exporta todos os modelos
export {
  UsuarioModel,
  EmbarcadorModel,
  TransportadorModel,
  EnderecoModel,
  VeiculoModel,
  CargaModel,
  OfertaModel
};

// Exporta como objeto para uso como namespace
const Models = {
  Usuario: UsuarioModel,
  Embarcador: EmbarcadorModel,
  Transportador: TransportadorModel,
  Endereco: EnderecoModel,
  Veiculo: VeiculoModel,
  Carga: CargaModel,
  Oferta: OfertaModel
};

export default Models;

// Exporta as interfaces também
export type { IUsuario } from './Usuario';
export type { IEmbarcador, IEmbarcadorCompleto } from './Embarcador';
export type { ITransportador, ITransportadorCompleto } from './Transportador';
export type { IEndereco } from './Endereco';
export type { IVeiculo } from './Veiculo';
export type { ICarga, ICargaCompleta } from './Carga';
export type { IOferta, IOfertaCompleta } from './Oferta'; 