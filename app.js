const express = require('express');
const app = express();
const mongoose = require('mongoose');
const usersRoute = require('./routes/users');
const sessionsRoute = require('./routes/sessions');
const transactionsRoute = require('./routes/transactions');
const swaggerUI = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocument = yaml.load('./docs/swagger.yaml');
const {processTransactions} = require('./middleware')



// Copy env variables  from .env file to process .env
require('dotenv').config()

// Run middleware
app.use(express.json())
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

//Attach routes
app.use('/users', usersRoute);
app.use('/sessions', sessionsRoute);
app.use('/transactions', transactionsRoute);

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, () => {
    console.log('Heihoo');
})

processTransactions()

app.listen( process.env.PORT, () => {
    console.log('listening on http://localhost:' + process.env.PORT);
})

//module.exports = app;