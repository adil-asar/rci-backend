import { verifyToken } from "../config/token.js";

export const authenticateUser = (req, res, next) => {

  try {
    const user_token = req.headers["authorization"];
    const token = user_token && user_token.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token not found" });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
    
  } catch (error) {
    return res.status(401).send(error.message); 
    console.log(error);
  }
};
