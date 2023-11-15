const express = require('express')
const logger = require('morgan')
const cors = require('cors')
// const { MongoClient } = require("mongodb");
require("./db");

// const DB_URI = "mongodb+srv://Tanja:ZP9BetQnnZNkKxlX@first-cluster.fftxkpz.mongodb.net/?retryWrites=true&w=majority"
// const client = new MongoClient(DB_URI);

const contactsRouter = require('./routes/api/contacts');
const authRouter = require('./routes/api/auth');

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter);
app.use('/api/users', authRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
