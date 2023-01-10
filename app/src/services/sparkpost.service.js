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
                    <p>Platform: ${content.platform}</p>
                    <p>Topic: ${content.queryRelate}</p>
                    <p>Query: ${content.query}</p>
                    </body></html>`
                },
                recipients: [{ address: config.get('sparkpost.recipient') }]
            })
    }
}

module.exports = SparkpostService;