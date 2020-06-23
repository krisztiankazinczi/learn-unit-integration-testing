const jwt = require('jsonwebtoken');


const verifytoken = (req,res,next) => {

    const token = req.header('auth-token');
    console.log(token)
    if(!token)
        return res.status(400).json('Token Not Provided in auth-token header');
    try {
        const jwtTokenVerify = jwt.verify(token, process.env.JWT_TOKEN_KEY);
        console.log(jwtTokenVerify)
        req.user = jwtTokenVerify;
        console.log("verify token successfull")
    }
    catch(err) {
        console.log(err)
        return res.status(400).json("Remember we have security in place , Go away , Wrong Token")
    }
    next(); 
};

module.exports = verifytoken;