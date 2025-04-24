import express from 'express';
const router = express.Router();
router.post('/', (req, res) => res.send('Produto criado'));
export default router;
