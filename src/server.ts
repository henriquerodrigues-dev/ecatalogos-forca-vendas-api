/**
 * @file server.ts
 * @description Arquivo principal para iniciar o servidor HTTP usando Express.
 * Escuta a porta definida no ambiente ou a 3000 por padrão.
 */

import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});