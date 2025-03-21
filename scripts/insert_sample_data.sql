-- Script para inserir dados de exemplo no FreteHub
-- Execute este script após criar todas as tabelas

-- Inserir usuário do tipo embarcador
INSERT INTO usuarios (id, nome, email, senha, telefone, tipo, documento, status)
VALUES (
  'e5f5d7e9-0c87-4a8e-95b3-9d79a4479722',
  'Empresa ABC Ltda',
  'contato@empresaabc.com.br',
  '$2a$10$FgF/Uy.T/PYLnSu8fJ7fU.XVNWAs3YnpR67Pbcmmz1X4OiST7gRoK', -- senha: senha123
  '(11) 3456-7890',
  'embarcador',
  '12.345.678/0001-90',
  'ativo'
);

-- Inserir informações do embarcador
INSERT INTO embarcadores (id, nome_empresa, cnpj, segmento)
VALUES (
  'e5f5d7e9-0c87-4a8e-95b3-9d79a4479722',
  'ABC Comércio e Distribuição',
  '12.345.678/0001-90',
  'Varejo'
);

-- Inserir usuário do tipo transportador (autônomo)
INSERT INTO usuarios (id, nome, email, senha, telefone, tipo, documento, status)
VALUES (
  'f8a7b6c5-d4e3-4f21-9a01-9a8b7c6d5e4f',
  'João da Silva',
  'joao.silva@email.com',
  '$2a$10$FgF/Uy.T/PYLnSu8fJ7fU.XVNWAs3YnpR67Pbcmmz1X4OiST7gRoK', -- senha: senha123
  '(11) 99876-5432',
  'transportador',
  '123.456.789-00',
  'ativo'
);

-- Inserir informações do transportador
INSERT INTO transportadores (id, tipo_transportador, cnh, categoria_cnh, validade_cnh, rntrc, possui_veiculo_proprio)
VALUES (
  'f8a7b6c5-d4e3-4f21-9a01-9a8b7c6d5e4f',
  'autonomo',
  '12345678901',
  'E',
  '2025-12-31',
  '12345678',
  TRUE
);

-- Inserir veículo para o transportador
INSERT INTO veiculos (id, transportador_id, tipo, subtipo, placa, renavam, marca, modelo, ano, capacidade_kg, capacidade_m3)
VALUES (
  'a1b2c3d4-e5f6-4a8b-9c0d-1e2f3a4b5c6d',
  'f8a7b6c5-d4e3-4f21-9a01-9a8b7c6d5e4f',
  'caminhao',
  'baú',
  'ABC1234',
  '12345678901',
  'Volkswagen',
  'Delivery 9.170',
  2020,
  8000.00,
  40.00
);

-- Inserir endereços
-- Endereço do embarcador
INSERT INTO enderecos (id, usuario_id, nome, cep, logradouro, numero, bairro, cidade, estado)
VALUES (
  'aa11bb22-cc33-dd44-ee55-ff66aa77bb88',
  'e5f5d7e9-0c87-4a8e-95b3-9d79a4479722',
  'Escritório Central',
  '01310-200',
  'Avenida Paulista',
  '1000',
  'Bela Vista',
  'São Paulo',
  'SP'
);

-- Endereço de origem do frete
INSERT INTO enderecos (id, nome, cep, logradouro, numero, bairro, cidade, estado)
VALUES (
  'bb22cc33-dd44-ee55-ff66-aa77bb88cc99',
  'Depósito ABC',
  '06454-000',
  'Rodovia Castelo Branco',
  'KM 30',
  'Tamboré',
  'Barueri',
  'SP'
);

-- Endereço de destino do frete
INSERT INTO enderecos (id, nome, cep, logradouro, numero, bairro, cidade, estado)
VALUES (
  'cc33dd44-ee55-ff66-aa77-bb88cc99dd00',
  'Centro de Distribuição',
  '30130-110',
  'Avenida Amazonas',
  '500',
  'Centro',
  'Belo Horizonte',
  'MG'
);

-- Inserir frete
INSERT INTO fretes (id, embarcador_id, titulo, descricao, tipo_carga, peso, volume, valor, origem_id, destino_id, data_coleta, data_entrega, status)
VALUES (
  'dd44ee55-ff66-aa77-bb88-cc99dd00ee11',
  'e5f5d7e9-0c87-4a8e-95b3-9d79a4479722',
  'Transporte de Eletrônicos SP-MG',
  'Frete de carga de eletrônicos da fábrica em Barueri até o centro de distribuição em Belo Horizonte',
  'Eletrônicos',
  2500.00,
  15.00,
  4800.00,
  'bb22cc33-dd44-ee55-ff66-aa77bb88cc99',
  'cc33dd44-ee55-ff66-aa77-bb88cc99dd00',
  '2023-04-10 08:00:00+00',
  '2023-04-12 16:00:00+00',
  'disponivel'
);

-- Inserir proposta para o frete
INSERT INTO propostas (id, frete_id, transportador_id, veiculo_id, valor, prazo_entrega, mensagem, status)
VALUES (
  'ee55ff66-aa77-bb88-cc99-dd00ee11ff22',
  'dd44ee55-ff66-aa77-bb88-cc99dd00ee11',
  'f8a7b6c5-d4e3-4f21-9a01-9a8b7c6d5e4f',
  'a1b2c3d4-e5f6-4a8b-9c0d-1e2f3a4b5c6d',
  4500.00,
  '2023-04-11 18:00:00+00',
  'Posso fazer este frete com segurança e dentro do prazo. Tenho experiência com transporte de eletrônicos.',
  'pendente'
);

-- Inserir notificação para o embarcador
INSERT INTO notificacoes (id, usuario_id, titulo, mensagem, tipo)
VALUES (
  'ff66aa77-bb88-cc99-dd00-ee11ff22aa33',
  'e5f5d7e9-0c87-4a8e-95b3-9d79a4479722',
  'Nova proposta recebida',
  'Você recebeu uma nova proposta para o seu frete "Transporte de Eletrônicos SP-MG"',
  'proposta'
); 