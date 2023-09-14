import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

export default {
    rabbitMQ: {
        URL: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
        queue: process.env.RABBITMQ_QUEUE || 'hello',
        exchange: process.env.RABBITMQ_EXCHANGE || 'test-exchange',
        pattern: process.env.RABBITMQ_PATTERN || 'test_routing_key_one',
    },
    username: process.env.CRED_USERNAME || 'admin',
    password: process.env.CRED_PASSWORD || 'admin',
    mailURL: process.env.MAIL_URL || 'mail',
};
