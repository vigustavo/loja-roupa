import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './common/logger.js';

const app = createApp();

app.listen(env.port, () => {
  logger.info(`API em execução na porta ${env.port}`);
});
