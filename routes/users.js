const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Users = require('../models/User');
const Account = require('../models/Account');
const { verifyToken } = require('../middleware')



router.post('/', async (req, res, next) => {

//Make sure credentials are given and correct
    if(typeof req.body.name === "undefined" || req.body.name.length < 2 || req.body.name.length > 50) {
        res.status(400).send({ error: "Invalid name" })
        return
    }

    if(typeof req.body.username === "undefined" || req.body.username.length < 2 || req.body.username.length > 50) {
        res.status(400).send({ error: "Invalid username" })
        return
    }

    if(typeof req.body.password === "undefined" || req.body.password.length < 8 || req.body.password.length > 255) {
        res.status(400).send({ error: "Invalid password" })
        return
    }
    // Hash the password
    req.body.password = await bcrypt.hash(req.body.password, 10);

    try {
        // Create new user to DB
        const user = await new Users(req.body).save();

        // Create new account for the user
        const account = await new Account({userId: user.id}).save();

        // Return user to client
        res.status(201).send({
            id: user.id,
            name: user.name,
            username: user.username,
            accounts: [account]
        });
    } catch (e) {

        // Catch duplicate username attempts
        if (/E11000.*username.* dup key.*/.test(e.message)) {
            res.status(400).send({error: "Username already exists"});

            // Stop the execution
            return
        }

        // Handle other errors
        res.status(409).send({error: e.message});
    }
});

router.get('/current', verifyToken, async(req, res, next) => {

    try {
        // Get user object from DB
        const user = await Users.findOne({_id: req.userId})
        console.log(user);
        // Get user's accounts
        const accounts = await Account.find({userId: req.userId});
        console.log(accounts);
        res.status(200).json({
            id: user.id,
            name: user.name,
            username: user.username,
            accounts: accounts
        })
    } catch (e) {
        res.status(400).send({error: e.message});
        console.log(e);
    }

})

module.exports = router;