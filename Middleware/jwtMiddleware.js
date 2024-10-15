// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken'

const jwtMiddleware = (req,res,next) => {
    
    try{
    //get token from the request header   
    const token = req.headers['authorization'].slice(7)

    
    //verify the token
    const jwtVerification = jwt.verify(token,process.env.JWT_SECRET);
    //set the id in payload
    req.payload = jwtVerification.userId;
   
    
    next()
    }
    catch(err){
        res.status(401).json({"Authorization error":err.message})
    }
}

export default jwtMiddleware;