import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    
    if (!token) {
        return res.status(403).json({
            error: "No token provided...!"
        });
    }
    
    jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            return res.status(403).json({
                error: "Unauthorized...!"
            });
        }
        req.email = decoded.email;
        next(); 
    });
};

export default verifyToken;
