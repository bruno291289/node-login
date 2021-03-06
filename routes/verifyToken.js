const jwt = require('jsonwebtoken');

module.exports = function (req, res, next){
    const token = req.header('auth-token');

    if(!token)
        return res.status(400).send('Acess Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        //console.log('verified '+JSON.stringify(verified));
        next();
    } catch (err) {
        console.log(err);
        res.status(400).send('Invalid Token');
    }
}