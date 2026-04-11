import jwt from "jsonwebtoken"




export function authUser(req, res ,next){
    
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            sucess: false,
            message: "Unauthorized. No token provided.",
            err: "No token provided"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        
        next();

    } catch (error) {
        res.status(401).json({
            message: "Unauthorize",
            sucess: false,
            err: "Invalid Token"
        })
    }

}