// Middleware to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      console.log('No token provided');
      return res.sendStatus(401);
    }
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        console.log('Token verification error:', err);
        return res.sendStatus(403);
      }
  
      req.user = user;
      next();
    });
  };
  