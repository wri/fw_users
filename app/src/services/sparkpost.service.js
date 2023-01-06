/* eslint-disable prettier/prettier */
import config from "config";
const SparkPost = require("sparkpost");
const sparky = new SparkPost(config.get('sparkpost.apiKey'));

class SparkpostService {
    static async sendMail(content) {
        
        return await sparky.transmissions
            .send({
                options: {
                },
                content: {
                    from: "noreply@globalforestwatch.org",
                    subject: "Forest Watcher Help",
                    html: `<html><body>
                    <p>From: ${content.fullname}</p>
                    <p>Email: ${content.email}</p>
                    <p>Tool: ${content.tool}</p>
                    <p>Topic: ${content.topic}</p>
                    <p>Message: ${content.message}</p>
                    </body></html>`
                },
                recipients: [{ address: config.get('sparkpost.recipient') }]
            })
    }
}

module.exports = SparkpostService;