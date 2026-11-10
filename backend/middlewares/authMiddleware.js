import jwt from 'jsonwebtoken';

const authenticate = async(req, res, next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith("Bearer")){
        return res.status(401).json({
            success: false,
            message: "Authentication token is required"
        })
    }

    const token = authHeader.split(" ")[1];
    try{
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        req.id = {
            userid : decode.userId
        }
        
        
        next()
    }catch(err){
        return res.status(401).json({
            success: false,
            message: "Invalid token or token expired"
        })
    }
}

export default authenticate;