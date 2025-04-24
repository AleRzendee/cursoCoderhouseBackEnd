export const authorize = (roles = []) => {
  return (req, res, next) => {
    const user = req.user || { role: 'user' }; // Simulação
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
};
