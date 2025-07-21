const jwt = require("jsonwebtoken")
const authMiddleware = (req, res, next)=>{
    let tokenData;
    // Get the token associated with Authorization header
    let bearerString = req.headers.authorization;
    let token = bearerString.split(" ")[1]
    // Check if the token is not expired
    try{
        // Decrypt the token and get the user data from the token
        tokenData = jwt.verify(token, "sagar@1997")
        // Attach the token data with req obj
        req.tokenData = tokenData
        // Call the next() method to pass the flow to the requested API
        next()
    }
    catch(e){
        console.log("Auth Middleware Error:", e);
        res.status(400).send("Unauthorized")
    }
    
    
}

module.exports = authMiddleware