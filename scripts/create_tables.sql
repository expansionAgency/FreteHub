-- Script para criar as tabelas necessárias para o FreteHub
-- Execute este script no SQL Editor do Supabase

-- Tabela de usuários (comum para transportadores e embarcadores)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL, -- Armazenar hash da senha, não a senha em texto puro
  telefone TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('embarcador', 'transportador', 'admin')),
  documento TEXT, -- CPF ou CNPJ
  foto_url TEXT,
  verificado BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado')),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Informações adicionais de transportadores
CREATE TABLE IF NOT EXISTS transportadores (
  id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo_transportador TEXT CHECK (tipo_transportador IN ('autonomo', 'empresa')),
  cnh TEXT,
  categoria_cnh TEXT,
  validade_cnh DATE,
  rntrc TEXT, -- Registro Nacional de Transportadores Rodoviários de Cargas
  possui_veiculo_proprio BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Informações adicionais de embarcadores
CREATE TABLE IF NOT EXISTS embarcadores (
  id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  nome_empresa TEXT,
  cnpj TEXT,
  segmento TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Veículos dos transportadores
CREATE TABLE IF NOT EXISTS veiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transportador_id UUID NOT NULL REFERENCES transportadores(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('caminhao', 'van', 'carro', 'moto', 'outro')),
  subtipo TEXT, -- ex: "baú", "carreta", "bitrem", etc.
  placa TEXT NOT NULL,
  renavam TEXT,
  marca TEXT,
  modelo TEXT,
  ano INTEGER,
  capacidade_kg DECIMAL(10,2),
  capacidade_m3 DECIMAL(10,2),
  comprimento DECIMAL(10,2),
  largura DECIMAL(10,2),
  altura DECIMAL(10,2),
  foto_url TEXT,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'em_manutencao')),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Endereços (para usuários, origens e destinos)
CREATE TABLE IF NOT EXISTS enderecos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  nome TEXT, -- Nome de referência (ex: "Depósito Central", "Escritório")
  cep TEXT NOT NULL,
  logradouro TEXT NOT NULL,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  pais TEXT DEFAULT 'Brasil',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fretes disponíveis para contratação
CREATE TABLE IF NOT EXISTS fretes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  embarcador_id UUID NOT NULL REFERENCES embarcadores(id) ON DELETE CASCADE,
  transportador_id UUID REFERENCES transportadores(id), -- Preenchido quando o frete for aceito
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo_carga TEXT NOT NULL,
  peso DECIMAL(10,2),
  volume DECIMAL(10,2),
  valor DECIMAL(10,2),
  origem_id UUID NOT NULL REFERENCES enderecos(id),
  destino_id UUID NOT NULL REFERENCES enderecos(id),
  data_coleta TIMESTAMP WITH TIME ZONE,
  data_entrega TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'em_negociacao', 'aceito', 'em_transito', 'entregue', 'cancelado')),
  requisitos_veiculo TEXT,
  observacoes TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Propostas de transportadores para fretes
CREATE TABLE IF NOT EXISTS propostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  frete_id UUID NOT NULL REFERENCES fretes(id) ON DELETE CASCADE,
  transportador_id UUID NOT NULL REFERENCES transportadores(id) ON DELETE CASCADE,
  veiculo_id UUID REFERENCES veiculos(id),
  valor DECIMAL(10,2) NOT NULL,
  prazo_entrega TIMESTAMP WITH TIME ZONE,
  mensagem TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceita', 'recusada', 'cancelada')),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(frete_id, transportador_id) -- Um transportador só pode fazer uma proposta por frete
);

-- Avaliações de fretes concluídos
CREATE TABLE IF NOT EXISTS avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  frete_id UUID NOT NULL REFERENCES fretes(id) ON DELETE CASCADE,
  avaliador_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  avaliado_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notificações do sistema
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  link TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Documentos dos usuários (CNH, RNTRC, etc.)
CREATE TABLE IF NOT EXISTS documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  arquivo_url TEXT NOT NULL,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verificado BOOLEAN DEFAULT FALSE,
  observacoes TEXT
);

-- Function para atualizar o timestamp de atualizado_em automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar o timestamp de atualizado_em
CREATE TRIGGER update_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_transportadores_updated_at
BEFORE UPDATE ON transportadores
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_embarcadores_updated_at
BEFORE UPDATE ON embarcadores
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_veiculos_updated_at
BEFORE UPDATE ON veiculos
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_enderecos_updated_at
BEFORE UPDATE ON enderecos
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_fretes_updated_at
BEFORE UPDATE ON fretes
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_propostas_updated_at
BEFORE UPDATE ON propostas
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- Função para verificar o status do serviço
CREATE OR REPLACE FUNCTION get_service_status()
RETURNS JSON AS $$
BEGIN
  RETURN json_build_object('status', 'available', 'timestamp', now());
END;
$$ LANGUAGE plpgsql; 