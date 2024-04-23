import jwt from 'jsonwebtoken'

const verifyToken = (req,res,next) => {
    const token = req.headers["authorization"]
    if(!token){
        res.status(404).json({
            status:"error",
            message:"No token provided...!"
        })
    }
    jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET, (error, decoded) => {
        if(error){
            res.status(401).json({
                error:"unauthorization..!"
            })
        }
        req.username = decoded.username
        next()
    })
}
export default verifyToken