import config from '../config.js';
import jwt from 'jsonwebtoken'

const JWT_SECRET = config.jwtSecret;

const authorization = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded, decoded.userId)
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

export default authorization; 
