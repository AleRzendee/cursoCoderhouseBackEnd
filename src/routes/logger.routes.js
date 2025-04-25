import express from 'express';
const router = express.Router();

router.get('/loggerTest', (req, res) => {
  req.logger.debug('Este é um log de debug');
  req.logger.http('Este é um log http');
  req.logger.info('Este é um log info');
  req.logger.warning('Este é um log warning');
  req.logger.error('Este é um log error');
  req.logger.fatal('Este é um log fatal');

  res.send('Logs testados com sucesso!');
});

export default router;
