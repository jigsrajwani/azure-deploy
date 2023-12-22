//try to fetch jwt_secret value from .env
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
require("dotenv").config();
// console.log("getUser se secret key aa rhi h",JWT_SECRET);

const getUser = (req, res, next) => {
    const token = req.header("auth-token");
    if(!token){
        res.status(401).send({error: "Please authenticate using a valid token"});
    }
    try{
        const data = jwt.verify(token, JWT_SECRET);
        // console.log(data);
        //use req.user in route
        req.user  = data.user;
        next();
    }
    catch(error){
        res.status(401).send({error: "Please authenticate using a valid token"});
    }
}
module.exports = getUser;