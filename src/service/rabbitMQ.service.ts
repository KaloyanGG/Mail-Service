import * as amqp from "amqplib";
import config from "../config/config";
import axios from "axios";




export class RabbitMQService {
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;

    private static instance: RabbitMQService;

    private constructor() { }
    static getInstance() {
        if (!RabbitMQService.instance) {
            RabbitMQService.instance = new RabbitMQService();
        }
        return RabbitMQService.instance;
    }

    async init() {
        try {
            this.connection = await amqp.connect(config.rabbitMQ.URL);
            this.channel = await this.connection.createChannel();
        } catch (error) {
            console.error("Error connecting to RabbitMQ: ", error);
            throw error;
        }
    }

    async startListener() {

        const rabbitMQConfig = config.rabbitMQ;

        console.log('Username and password: ')
        console.log(config.username, config.password);

        const queueName = rabbitMQConfig.queue;
        const exchange = rabbitMQConfig.exchange;
        const pattern = rabbitMQConfig.pattern;


        if (this.channel === null) {
            console.error('RabbitMQ channel is not initialized.');
            return;
        }

        try {
            await this.channel.assertQueue(queueName, { durable: false });
            //durable?
            await this.channel.assertExchange(exchange, 'direct', { durable: false });
            // routing key = pattern
            await this.channel.bindQueue(queueName, exchange, pattern);

            this.channel.consume(queueName, async (message: amqp.ConsumeMessage | null) => {
                if (message !== null) {

                    const content: { name: string, amount: number, email: string } = JSON.parse(message.content.toString());

                    const sendMailURL = config.mailURL;


                    const { data, status } = await axios
                        .post(config.mailURL,
                            content
                            , {
                                auth: {
                                    username: config.username,
                                    password: config.password,
                                },
                                headers: {
                                    'Content-Type': 'text/plain',
                                },
                            });


                    if (status !== 200) {
                        console.error(`Error sending email`);
                        this.channel!.nack(message); // Reject the message
                        return;
                    }


                    console.log(` 🐰 Received message from RabbitMQ: ${JSON.stringify(content)}`);

                    console.log(` 📫 Email sent to ${content.email}!`);

                    this.channel!.ack(message); // Acknowledge that the message has been processed
                }
            }, { noAck: false });
        } catch (error) {
            console.error(`Error starting RabbitMQ listener: ${error}`);
        }
    }

    getChannel() {
        return RabbitMQService.instance.channel;
    }
    getConnection() {
        return RabbitMQService.instance.connection;
    }
    closeConnection() {
        RabbitMQService.instance.connection?.close();
    }
}

export default RabbitMQService.getInstance();

