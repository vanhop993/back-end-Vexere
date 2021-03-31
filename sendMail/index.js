const nodemailer = require("nodemailer");
const {google} = require("googleapis"); 

const CLIENT_ID="628495028887-vqsunq4lgnqm6qdtfdfdl7ouekt47pqt.apps.googleusercontent.com";
const CLINET_SECRET="5Q1NsmmobPDBfnjQ3_BkrTMC";
const REDIRECT_UTL ="https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04D0zALgrA2RNCgYIARAAGAQSNwF-L9IryjVNrO5_7a3S0rJJJ8c1SDnVUwwtNS31vxzXX6aQF0N0bJIzFpwBH8s45wU0fkYjDNg";

const OAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLINET_SECRET,REDIRECT_UTL);
OAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});

async function sendEmail(email,contentMail) {
    try{
        const accessToken = await OAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
                type:"OAuth2",
                user: 'hopdo993@gmail.com',
                clientId:CLIENT_ID,
                clientSecret:CLINET_SECRET,
                refreshToken:REFRESH_TOKEN,
                accessToken,
            }
        })
        let mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'VexereCuoiKhoa <hopdo993@gmail.com>',
            to: email,
            subject:contentMail.subject,
            text: 'You recieved message from ' + email,
            html: contentMail.html, 
        }
        const result = await transport.sendMail(mainOptions, await function(err, info) {
            if (err) return err;
            return info;
          });
        return result;
    }catch(err) {
        console.log(err);
    }
}

module.exports = sendEmail;