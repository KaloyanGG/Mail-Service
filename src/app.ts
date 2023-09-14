import config from './config/config';
import { test } from './send-mail-test';
import rabbitMQService from './service/rabbitMQ.service';

// process.on('exit', () => {
//     console.log('Exit RabbitMQ service');
//     rabbitMQService.closeConnection();
// });

// process.on('SIGINT', () => {
//     process.exit(0);
// });

async function startService() {

    try {
        await rabbitMQService.init();
        console.log(' 🐇 RabbitMQ connected!');
        await rabbitMQService.startListener();
        console.log(` 🐇📫 RabbitMQ listener FOR EMAILS started in ${config.rabbitMQ.queue} queue!`);
    } catch (e: any) {
        console.error(`Error connecting to RabbitMQ: ${e}`);
        process.exit(1);
    }


}

startService();
// test();