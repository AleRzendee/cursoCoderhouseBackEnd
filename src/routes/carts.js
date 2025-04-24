import express from 'express';
import { purchaseCart } from '../services/TicketService.js';
const router = express.Router();

router.post('/:cid/purchase', async (req, res) => {
  const result = await purchaseCart(req.params.cid, 'user@example.com');
  res.json(result);
});

export default router;
