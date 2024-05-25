import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Initialize dotenv to use environment variables
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

/**
 * Middleware to verify JWT token.
 * This middleware checks if the request has a valid JWT token in the Authorization header.
 * If the token is valid, it attaches the decoded user information to the request and allows the request to proceed.
 * If the token is not valid, it responds with an error.
 */
function verifyToken(req, res, next) {
  // Access the token directly from the cookies
  const token = req.cookies['token']; // Assuming the cookie name is 'token'
  if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded; // Attach decoded token (user info) to request object
      next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log("error:",error)
      res.status(400).json({ error: 'Invalid token.' });
  }
}


function verifyServiceToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Authorization: Bearer TOKEN
  if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  try {
      const decoded = jwt.verify(token, SECRET_KEY);
      // Check if the serviceAccountId is present and matches the expected value
      if (decoded.SERVICE_ACCOUNT_ID && decoded.SERVICE_ACCOUNT_ID === process.env.SERVICE_ACCOUNT_ID) {
          req.user = decoded; // Optionally attach user info to the request object
          next(); // Proceed to the next middleware or route handler
      } else {
          res.status(403).json({ error: 'Unauthorized: Invalid service account ID.' });
      }
  } catch (error) {
      res.status(400).json({ error: 'Invalid token.' });
  }
}

export { verifyToken, verifyServiceToken };

