const ElasticEmail = require('@elasticemail/elasticemail-client');
const { ELASTICE_API_KEY} = process.env;

const defaultClient = ElasticEmail.ApiClient.instance;
const {apikey} = defaultClient.authentications;
apikey.apiKey = ELASTICE_API_KEY;
const api = new ElasticEmail.EmailsApi();


function sendEmail(email) {
    return new Promise((resolve, reject) => {
        api.emailsPost(email, (error, data, response) => {
            if (error) {
                console.error(error);
                reject(error)
            } else {
                console.log("Successfully");
                resolve(data);
            }
        })
    })
}

module.exports = sendEmail;
