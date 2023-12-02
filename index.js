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
    console.error(error.message);
  } else {
    console.log('API called successfully.');
  }
};

api.emailsPost(email, callback);