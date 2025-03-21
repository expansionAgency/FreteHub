-- Criação do banco de dados FreteHub
CREATE DATABASE IF NOT EXISTS fretehub;
USE fretehub;

-- Tabela de usuários (compartilhada entre embarcadores e transportadores)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, -- Armazenar hash da senha, nunca senha plaintext
    tipo_usuario ENUM('embarcador', 'transportador') NOT NULL,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    documento VARCHAR(20) NOT NULL, -- CPF ou CNPJ
    documento_tipo ENUM('cpf', 'cnpj') NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    verificado BOOLEAN DEFAULT FALSE,
    token_verificacao VARCHAR(100),
    data_expiracao_token TIMESTAMP NULL,
    ativo BOOLEAN DEFAULT TRUE,
    foto_perfil VARCHAR(255) NULL,
    INDEX idx_email (email),
    INDEX idx_tipo_usuario (tipo_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela para dados específicos de embarcadores
CREATE TABLE IF NOT EXISTS embarcadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    razao_social VARCHAR(255) NULL,
    nome_fantasia VARCHAR(255) NULL,
    inscricao_estadual VARCHAR(50) NULL,
    segmento VARCHAR(100) NULL,
    site VARCHAR(255) NULL,
    quantidade_funcionarios INT NULL,
    volume_medio_cargas INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY idx_usuario_id (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela para dados específicos de transportadores
CREATE TABLE IF NOT EXISTS transportadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    razao_social VARCHAR(255) NULL,
    nome_fantasia VARCHAR(255) NULL,
    inscricao_estadual VARCHAR(50) NULL,
    antt VARCHAR(50) NULL, -- Registro na Agência Nacional de Transportes Terrestres
    tipo_transportador ENUM('autonomo', 'empresa', 'cooperativa') NOT NULL DEFAULT 'autonomo',
    anos_experiencia INT NULL,
    possui_frota BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY idx_usuario_id (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de endereços dos usuários
CREATE TABLE IF NOT EXISTS enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('residencial', 'comercial', 'correspondencia', 'outro') NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100) NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    principal BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de veículos dos transportadores
CREATE TABLE IF NOT EXISTS veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transportador_id INT NOT NULL,
    placa VARCHAR(10) NOT NULL,
    renavam VARCHAR(50) NULL,
    tipo_veiculo ENUM('caminhao_pequeno', 'caminhao_medio', 'caminhao_grande', 'carreta', 'bitrem', 'outro') NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    ano_fabricacao INT NOT NULL,
    capacidade_carga DECIMAL(10,2) NOT NULL, -- em toneladas
    tipo_carroceria ENUM('aberta', 'fechada', 'bau', 'sider', 'graneleira', 'tanque', 'refrigerada', 'outra') NOT NULL,
    altura_interna DECIMAL(5,2) NULL, -- em metros
    largura_interna DECIMAL(5,2) NULL, -- em metros
    comprimento_interno DECIMAL(5,2) NULL, -- em metros
    proprio BOOLEAN DEFAULT TRUE,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (transportador_id) REFERENCES transportadores(id) ON DELETE CASCADE,
    INDEX idx_transportador_id (transportador_id),
    INDEX idx_placa (placa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de documentos (CNH, certificados, etc.)
CREATE TABLE IF NOT EXISTS documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo_documento ENUM('cnh', 'contrato_social', 'rg', 'cpf', 'cnpj', 'comprovante_endereco', 'antt', 'certificado_veiculo', 'outro') NOT NULL,
    numero_documento VARCHAR(50) NULL,
    data_emissao DATE NULL,
    data_validade DATE NULL,
    arquivo_url VARCHAR(255) NOT NULL,
    verificado BOOLEAN DEFAULT FALSE,
    observacoes TEXT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de cargas (publicadas pelos embarcadores)
CREATE TABLE IF NOT EXISTS cargas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    embarcador_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NULL,
    tipo_carga ENUM('geral', 'frigorificada', 'perecivel', 'viva', 'perigosa', 'indivisivel', 'valiosa', 'outra') NOT NULL,
    peso DECIMAL(10,2) NOT NULL, -- em kg
    volume DECIMAL(10,2) NULL, -- em m³
    valor_declarado DECIMAL(12,2) NULL, -- em R$
    valor_frete DECIMAL(12,2) NULL, -- em R$
    aceita_ofertas BOOLEAN DEFAULT TRUE,
    origem_cep VARCHAR(10) NOT NULL,
    origem_cidade VARCHAR(100) NOT NULL,
    origem_estado CHAR(2) NOT NULL,
    destino_cep VARCHAR(10) NOT NULL,
    destino_cidade VARCHAR(100) NOT NULL,
    destino_estado CHAR(2) NOT NULL,
    data_coleta DATE NOT NULL,
    hora_coleta TIME NULL,
    data_entrega DATE NOT NULL,
    hora_entrega TIME NULL,
    status ENUM('aberta', 'em_negociacao', 'atribuida', 'em_transito', 'entregue', 'cancelada') DEFAULT 'aberta',
    transportador_id INT NULL, -- preenchido quando a carga é atribuída
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (embarcador_id) REFERENCES embarcadores(id),
    FOREIGN KEY (transportador_id) REFERENCES transportadores(id),
    INDEX idx_embarcador_id (embarcador_id),
    INDEX idx_transportador_id (transportador_id),
    INDEX idx_status (status),
    INDEX idx_data_coleta (data_coleta),
    INDEX idx_origem_destino (origem_estado, destino_estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de ofertas (propostas dos transportadores para as cargas)
CREATE TABLE IF NOT EXISTS ofertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carga_id INT NOT NULL,
    transportador_id INT NOT NULL,
    valor_proposto DECIMAL(12,2) NOT NULL, -- em R$
    observacoes TEXT NULL,
    veiculo_id INT NULL, -- qual veículo seria usado
    status ENUM('pendente', 'aceita', 'recusada', 'cancelada') DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_resposta TIMESTAMP NULL,
    FOREIGN KEY (carga_id) REFERENCES cargas(id) ON DELETE CASCADE,
    FOREIGN KEY (transportador_id) REFERENCES transportadores(id),
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id),
    UNIQUE KEY uk_carga_transportador (carga_id, transportador_id),
    INDEX idx_carga_id (carga_id),
    INDEX idx_transportador_id (transportador_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de avaliações entre usuários
CREATE TABLE IF NOT EXISTS avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    avaliador_id INT NOT NULL,
    avaliado_id INT NOT NULL,
    carga_id INT NOT NULL,
    nota DECIMAL(3,1) NOT NULL, -- de 0 a 5, com uma casa decimal
    comentario TEXT NULL,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (avaliador_id) REFERENCES usuarios(id),
    FOREIGN KEY (avaliado_id) REFERENCES usuarios(id),
    FOREIGN KEY (carga_id) REFERENCES cargas(id),
    UNIQUE KEY uk_avaliacao (avaliador_id, avaliado_id, carga_id),
    INDEX idx_avaliado_id (avaliado_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de logs de acesso ao sistema
CREATE TABLE IF NOT EXISTS logs_acesso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(45) NOT NULL,
    dispositivo VARCHAR(255) NULL,
    navegador VARCHAR(255) NULL,
    sucesso BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_data_hora (data_hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela para controle de sessões ativas
CREATE TABLE IF NOT EXISTS sessoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    data_expiracao TIMESTAMP NOT NULL,
    ultimo_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(45) NULL,
    dispositivo VARCHAR(255) NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_usuario_id (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela para tokens de reset de senha
CREATE TABLE IF NOT EXISTS reset_senha (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    data_expiracao TIMESTAMP NOT NULL,
    utilizado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo ENUM('sistema', 'carga', 'oferta', 'pagamento', 'avaliacao', 'outro') NOT NULL,
    referencia_id INT NULL, -- ID do objeto relacionado (carga, oferta, etc)
    lida BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_leitura TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_lida (lida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 