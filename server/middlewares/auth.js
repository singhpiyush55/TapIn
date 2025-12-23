// Its job is to catch the auth header and verify 
//      if it is correct then pass the decoded message 
//      if it fails the send a message for relogin --> Later rediredt it to the login or home page. 

const jwt = require('jsonwebtoken');

function auth(req, res, next){
    // Get the header --> Get the token --> Verify the JWT. 
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        res.status(401).json({message: "Header not found."}); 
        return; 
    }

    const token = authHeader.split(' ')[1];
    if(!token){
        res.status(401).send("Token not provided.")
        return;
    }

    try{
        const decoded = jwt.verify(token, process.env.JWTSECRET);
        // console.log(decoded);
        // no need to add the admin's email in the body as the body is carrying users data and we dont need this further.
        req.user = decoded;
        next();
        //res.status(200).send("OK");
    }catch(err){
        res.status(401).send("Invalid Token.");
        return;
    }
}

module.exports = auth;