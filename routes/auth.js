const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const error = await new User().validateUserData(req.body);

        if(error){
            return res.status(400).send(error);
        }

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        const savedUser = await user.save();
        res.send({_id: savedUser._id});
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const error = await new User().validateLoginData(req.body);

        if(error){
            return res.status(400).send(error);
        }

        const user = await User.findOne({email: req.body.email});

        if (!user || !(await user.validatePassword(req.body.password))){
            return res.status(400).send('Email or password is wrong.');
        }

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.header('auth-token', token);

        res.send({name: user.name, email: user.email, _id: user._id});
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});


module.exports = router;