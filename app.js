require('dotenv').config();
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require("node:path");

require("./db");

const auth = require('./middleware/auth');
const contactsRouter = require('./routes/api/contacts');
const authRouter = require('./routes/api/auth');
const userRouter = require('./routes/api/users');

// SEND EMAIL
const ElasticEmail = require('@elasticemail/elasticemail-client');
const { ELASTICE_API_KEY, EMAIL_FROM } = process.env;

const defaultClient = ElasticEmail.ApiClient.instance;
const {apikey} = defaultClient.authentications;
apikey.apiKey = ELASTICE_API_KEY;
const api = new ElasticEmail.EmailsApi();

const email = ElasticEmail.EmailMessageData.constructFromObject({
  Recipients: [
    new ElasticEmail.EmailRecipient("fiediak97@gmail.com")
  ],
  Content: {
    Body: [
      ElasticEmail.BodyPart.constructFromObject({
        ContentType: "HTML",
        Content: "<strong>Node js welcome</strong>"
      })
    ],
    Subject: "From Tanya with best regards",
    From: EMAIL_FROM
  }
});

const callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log("API");
  }
};

api.emailsPost(email, callback);





const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())


app.use('/api/contacts', auth, contactsRouter);
app.use('/api/users', authRouter);
app.use('/api/users', auth, express.static(path.join(__dirname, "public", "avatars")), userRouter);



app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
