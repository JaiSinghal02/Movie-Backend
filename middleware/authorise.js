//middle ware function
const jwt=require('jsonwebtoken');

module.exports=function(req,res,next){
    const token=req.header('x-auth-token');
    //console.log(token);
    if(!token) return res.status(401).send('Access Denied: No token provided');

    try{
    const decoded=jwt.verify(token,'aSecretPassword');
    req.user=decoded;
    }
    catch(ex){
        return res.status(400).send('Access Denied: Invalid token');
    }
    next();
}