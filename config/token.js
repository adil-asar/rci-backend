import jwt from "jsonwebtoken";

const secretKey = "rci-backend-2025";

export const generateToken = (user) => {
  
    try {
        const payload = {
            id: user._id,
            first_name: user.firstname,
            last_name: user.lastname,
            phone: user.phone,
            email: user.email,
            role: user.role,
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: "7d" });

        return token;
    } catch (error) {
        console.log("Error generating token:", error);
        return null;
    }
};

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
      } catch (error) {
        console.log(error);
      }
}