//This is RBAC (Role-Based Access Control) middleware
// Usage: rbac(['admin','teacher'])
exports.rbacMiddleware = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const roleName = req.user.role?.name;
  if (!roleName) return res.status(403).json({ error: 'Forbidden' });
  if (roleName === 'superadmin') return next(); // superadmin bypass
  if (allowedRoles.includes(roleName)) return next();
  return res.status(403).json({ error: 'Forbidden' });
};
