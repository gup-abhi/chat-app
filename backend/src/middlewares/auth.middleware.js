import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    const tokent = req.cookies.jwt;

    if (!tokent) {
      return res.status(401).send({ message: 'Unauthorized, no token provided' });
    }

    const decoded = jwt.verify(tokent, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).send({ message: 'Unauthorized, invalid token' });
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    
    // Attach user to request object for further use in the route handlers
    req.user = user;

    next();
  } catch (error) {
    console.error('Error in protectRoute middleware:', error.message);
    res.status(401).send({ message: 'Unauthorized, invalid token' });
  }
}