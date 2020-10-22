const router = require('express').Router();
const userModel = require('../models/User')
const accountModel = require('../models/Account')
const bankModel = require('../models/Bank')
const { verifyToken, refreshBanksFromCentralBank } = require('../middleware')
const fetch = require('node-fetch')
const transactionsModel = require('../models/Transaction')


require('dotenv').config()


router.post('/', verifyToken, async (req, res, next) => {

    let banks = [], statusDetail

    // Get account from db
    const accountFromObject = await accountModel.findOne({number: req.body.accountFrom})

    // Check that account exists
    if (!accountFromObject) {
        return res.status(404).json({error: 'Account not found'})
    }

    // Check that accountFrom belongs to the user
    if (accountFromObject.userId.toString() !== req.userId.toString()) {
        return res.status(403).json({error: 'Forbidden'})
    }

    //Check for sufficient funds
    if (req.body.amount > accountFromObject.balance) {
        return res.status(402).json({error: 'Insufficient funds'})
    }

    // Check for invalid amounts
    if (req.body.status <= 0)
        return res.status(400).json({error: 'Invalid amount'})

    // Check destination bank
    const bankToPrefix = req.body.accountTo.slice(0, 3)
    let bankTo = await bankModel.findOne({bankPrefix: bankToPrefix})

    // Check destination bank

    if (!bankTo) {

        // Refresh banks from central bank
        const result = await refreshBanksFromCentralBank();

        // Check if there was an error
        if (typeof result.error !== 'undefined'){

            // Log the error to transaction
            statusDetail = result.error
        } else {

            // Try getting the details of the destination bank again
            bankTo = await bankModel.findOne({bankPrefix: bankToPrefix})

            // Check for destination bank once more
            if (!bankTo) {
                return res.status(400).json({error: 'Invalid accountTo'})
            }
        }

    } else {
        console.log('Destination was found in cache');
    }

    //Make new transaction
    console.log('Creating transaction...');
    const transaction = transactionsModel.create({
        userId: req.userId,
        amount: req.body.amount,
        currency: accountFromObject.currency,
        accountFrom: req.body.accountFrom,
        accountTo: req.body.accountTo,
        explanation: req.body.explanation,
        statusDetail,
        senderName: ( await userModel.findOne({_id: req.userId})).name,
    })


    // Check for sufficient funds
    return res.status(201).json()

})
router.post('/b2b', verifyToken, async (req, res, next) => {

    // Get jwt from body

    const jwt = req.header('Api-Key');
    if (!ApiKey) return res.status(400).json({error: 'Missing Api-Key header'});


    // Verify accounts

    // Get bank's prefix

    // Get bank's jwksUrl

    // Get bank's public key
    const ApiKey = req.header('Api-Key');
    if (!ApiKey) return res.status(400).json({error: 'Missing Api-Key header'});

    // Verify signature

    // Convert currency

    // Increase accountTo

    // Create transaction

    // Send receiverName

})


module.exports = router;