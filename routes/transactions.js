const router = require('express').Router();
const User = require('../models/user');
const Account = require('../models/Account');
const Bank = require('../models/Bank');
const Transaction = require('../models/Transaction');
const {verifyToken, refreshBanksFromCentralBank} = require('../middleware');
const fetch = require('node-fetch');
const jose = require('node-jose');

require('dotenv').config();

router.post('/', verifyToken, async (req, res, next) => {

    let banks = [], statusDetail;

    // Get account data from DB
    const accountFromObject = await Account.findOne({number: req.body.accountFrom});

    // Check that account exists
    if (!accountFromObject) {
        return res.status(404).json({error: 'Account not found'});
    }

    // Check that accountFrom belongs to the user
    if (accountFromObject.userId.toString() !== req.userId.toString()) {
        return res.status(403).json({error: 'Forbidden'});
    }

    // Check for sufficient funds
    if (req.body.amount > accountFromObject.balance) {
        return res.status(402).json({error: 'Insufficient funds'});

    }

    // Check for invalid amounts
    if (req.body.amount <= 0) {
        return res.status(400).json({error: 'Invalid amount'});
    }

    const bankToPrefix = req.body.accountTo.slice(0, 3);
    let bankTo = await Bank.findOne({bankPrefix: bankToPrefix});

    // Check destination bank
    if (!bankTo) {

        // Refresh banks from central bank
        const result = await refreshBanksFromCentralBank();

        // Check if there was an error
        if (typeof result.error !== 'undefined') {

            // Log the error to transaction
            console.log('There was an error communicating with central bank:');
            console.log(result.error);
            statusDetail = result.error;

        } else {

            // Try getting the details of the destination bank again
            bankTo = await Bank.findOne({bankPrefix: bankToPrefix});

            // Check for destination bank once more
            if (!bankTo) {
                return  res.status(400).json({error: "Invalid accountTo"});
            }
        }

    } else {
        console.log('Destination bank was found in cache');
    }

    // Make new transaction
    console.log('Creating transaction...');
    const transaction = Transaction.create({
        userId: req.userId,
        amount: req.body.amount,
        currency: accountFromObject.currency,
        accountFrom: req.body.accountFrom,
        accountTo: req.body.accountTo,
        explanation: req.body.explanation,
        statusDetail,
        senderName: (await User.findOne({_id: req.userId})).name
    })

    return res.status(201).json()
})

router.post('/b2b', async (req, res, next) => {

    // Get jwt from body
    jwt = req.body.jwt;

    // Extract accountTo

    // Verify accountTo

    // Get bank's prefix

    // Get bank's jwksUrl

    // Get bank's public key

    // Verify signature

    // Convert currency

    // Increase accountTo

    // Create transaction

    // Send receiverName

})
module.exports = router;