# FreteHub

FreteHub é uma plataforma que conecta embarcadores e transportadores de todo o Brasil, simplificando a cotação, contratação e gerenciamento de fretes.

## Configuração do Banco de Dados Supabase

Para configurar o banco de dados Supabase para este projeto, siga as etapas abaixo:

### 1. Criar uma conta no Supabase

- Acesse [https://supabase.com/](https://supabase.com/)
- Clique em "Start your project" e crie uma conta (ou faça login)
- Crie um novo projeto, dando um nome e definindo uma senha segura

### 2. Obter as credenciais de API

Após criar o projeto:
- Vá para "Project Settings" > "API"
- Copie a "URL" e a "anon key" 
- Cole estas informações no arquivo `.env` do projeto:

```
SUPABASE_URL=sua-url-do-supabase
SUPABASE_KEY=sua-chave-anon-do-supabase
```

### 3. Criar as tabelas do banco de dados

No painel do Supabase:
- Vá para "SQL Editor"
- Crie uma nova consulta
- Cole o conteúdo do arquivo `scripts/create_tables.sql`
- Execute o script para criar todas as tabelas

### 4. (Opcional) Inserir dados de exemplo

Para adicionar dados de teste:
- Vá para "SQL Editor" novamente
- Crie uma nova consulta
- Cole o conteúdo do arquivo `scripts/insert_sample_data.sql`
- Execute o script para inserir os dados de exemplo

### 5. Verificar a conexão

Para testar se a conexão com o Supabase está funcionando:
- Inicie o servidor de desenvolvimento: `npm run dev`
- Acesse: `http://localhost:3000/exemplos/db-test`
- Ou a API: `http://localhost:3000/api/test-db`

## Estrutura do Banco de Dados

O banco de dados do FreteHub é composto pelas seguintes tabelas:

1. `usuarios` - Armazena todos os usuários, sejam eles embarcadores ou transportadores
2. `embarcadores` - Informações específicas dos embarcadores (empresas que precisam transportar cargas)
3. `transportadores` - Informações específicas dos transportadores (autônomos ou empresas)
4. `veiculos` - Cadastro dos veículos dos transportadores
5. `enderecos` - Endereços dos usuários e pontos de coleta/entrega
6. `fretes` - Cadastro de oportunidades de fretes disponíveis
7. `propostas` - Propostas feitas pelos transportadores para os fretes
8. `avaliacoes` - Avaliações após a conclusão dos fretes
9. `notificacoes` - Sistema de notificações da plataforma
10. `documentos` - Armazenamento de documentos dos usuários

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em [http://localhost:3000](http://localhost:3000). 