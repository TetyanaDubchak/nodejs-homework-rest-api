const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require("node:path");

require("./db");

const auth = require('./middleware/auth');
const contactsRouter = require('./routes/api/contacts');
const authRouter = require('./routes/api/auth');
const userRouter = require('./routes/api/users');


const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())


app.use('/api/contacts', auth, contactsRouter);
app.use('/api/users', authRouter);
app.use('/api/users', auth,express.static(path.join(__dirname, "public", "avatars")), userRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
