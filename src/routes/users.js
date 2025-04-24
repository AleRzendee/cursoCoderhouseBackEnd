import express from 'express';
const router = express.Router();
router.get('/current', (req, res) => {
  const user = { _id: '1', name: 'Alice', email: 'alice@example.com', role: 'user' };
  const dto = { id: user._id, name: user.name, email: user.email, role: user.role };
  res.json(dto);
});
export default router;
