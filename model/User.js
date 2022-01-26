const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 40,
        unique: true
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max:255,
        unique: true
    },
    password: {
        type: String,
        require: true,
        max: 1024,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.validateUserData = async function (data){
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    const {error} = await schema.validate(data);

    if(error){
        return error.details[0].message;
    }
};

userSchema.methods.validateLoginData = async function (data){
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    const {error} = await schema.validate(data);

    if(error){
        return error.details[0].message;
    }
};

userSchema.methods.hashThePassword = async function (){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    return hashedPassword;
};

userSchema.methods.validatePassword = async function (p){
    return await bcrypt.compare(p, this.password);
};

userSchema.pre('save', async function (next) {
    if(this.isModified('password'))
        this.password = await this.hashThePassword();
    next();
});

userSchema.plugin(uniqueValidator, {message: 'The {PATH} already exists.'});

module.exports = mongoose.model('User', userSchema);