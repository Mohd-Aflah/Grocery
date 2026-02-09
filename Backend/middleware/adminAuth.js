/**
 * Admin Authentication Middleware
 * Validates admin access based on password
 */

export const adminAuth = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'n1$#@D16';
  const providedPassword = req.headers['x-admin-password'] || 
                           req.body?.admin_password;

  if (!providedPassword || providedPassword !== adminPassword) {
    return res.status(401).json({ 
      message: 'Unauthorized - Invalid admin password' 
    });
  }

  next();
};

export default adminAuth;
