# A7 — API de Descarte (NestJS + MongoDB)

## Como rodar
1. Renomeie `.env.example` para `.env` e ajuste `MONGO_URI`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie a API (como no enunciado):
   ```bash
   npm run start
   ```
4. Teste:
   - Hello World: `http://localhost:3000`
   - Rotas:
     - `POST /descarte/pontos`
     - `GET  /descarte/pontos`
     - `POST /descarte/registros`
     - `GET  /descarte/registros`
     - `GET  /relatorio`

## Rotas de exemplo
Use `test/requests.http` no VSCode (extensão REST Client) ou cURL do guia.

## Seed (opcional)
```bash
npm run seed
```
Cria 1 ponto e alguns registros.
# A7-AplicandoConhecimento-Web-Mobile
