const express = require('express')
const logger = require('morgan')
const cors = require('cors')
// const { MongoClient } = require("mongodb");
require("./db");

// const DB_URI = "mongodb+srv://Tanja:ZP9BetQnnZNkKxlX@first-cluster.fftxkpz.mongodb.net/?retryWrites=true&w=majority"
// const client = new MongoClient(DB_URI);

const contactsRouter = require('./routes/api/contacts')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)

// async function run() {
//   try {
//     await client.connect();
//     const dbContacts = client.db('db-contacts');
//     const name = 'contacts'
//     const collection = await dbContacts.collection(name)
//     const allContacts = await collection.find({}).toArray();
//     console.log(allContacts);
//   } catch (error) {
//     console.error(error);
//   } finally {
//     await client.close()
//   }
// }
//  run().catch(console.error)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
