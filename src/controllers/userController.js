const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.createUser = async(req, res)=>{
    try{
        await User.create({
            first_name: 'Vitraya',
            last_name: 'Tech',
            user_id: 'admin',
            pin: (await bcrypt.hash('1234', 10))
        })

        res.status(200).json('ok');
    } catch(Err){
        throw new Error(Err);
    }
}

exports.loginUser = async(req, res)=>{
    try{
        const {user_id, pin} = req.query;
        const user = await User.findOne({user_id: user_id});
        if(!user){
            return res.status(401).json({message: 'User is not exist'});
        }

        // check password is correct or not
        if(!(await user.correctPassword(pin, user.pin))){
            return res.status(401).json({message: 'UserId or Pin is incorrect!'});
        }

        // generate jw token
        const token = await user.generateAuthToken();
        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
        });

        res.status(200).json({
            status: "success",
            message: "user logged in succesfully",
        });
    } catch(Err){
        console.log(Err)
        // throw new Error(Err);
    }
}

exports.getUser = async(req, res)=>{
    try{

    } catch(err){
        throw new Error(err);
    }
}