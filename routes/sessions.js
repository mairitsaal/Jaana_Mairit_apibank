const router = require('express').Router();
const Session = require('../models/Sessions');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { verifyToken } = require('../middleware')

router.post('/', async (req, res, next) => {

    // Validate username or password is not empty
    if(!req.body.password || !req.body.username) {
        return res.status(400).json({error: "Username or password needed!"});
    }

    // Get user by username from database
    const user = await User.findOne({username: req.body.username})

    // Validate username and password
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
        return res.status(401).json({error:"Invalid username/password"})
    }

    // Create session to database
    const session = await Session.create({
        userId: user.id
    })

    // Return token to user
    return res.status(200).json({token:session._id})
})

router.delete('/', verifyToken, async (req, res, next) => {

    try {
        // Get session by userId from database
        const session = await Session.findOne({userId: req.userId})

        // Check that session existed in the DB
        if(!session){
            return res.status(404).json({error:'Invalid  session'})
        }

        // Delete session from the database
        await Session.deleteOne({_id:session._id.toString()})

        // Return token to user
        return res.status(204).json()

    } catch (e) {
        return res.status(400).json({error:e.message})
    }
})

module.exports = router;