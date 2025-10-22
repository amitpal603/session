const requireAuth = (req, res, next) => {
  if (req.session.user && req.session.user.isLoggedIn) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please login.'
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isLoggedIn && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
};

const attachUser = (req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user;
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  attachUser
};