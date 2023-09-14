import axios from "axios";
import config from "./config/config";


export async function test() {
    try {

        const sendMailURL = config.mailURL;

        const { data, status } = await axios
            .post(config.mailURL,
                {
                    "email": "kokicha.gg@gmail.com",
                    "name": "KokoCorporation",
                    "amount": 100
                }
                , {
                    auth: {
                        username: config.username,
                        password: config.password,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        console.log(data);
        console.log('-----------------');
        console.log(status);
    } catch (e) {
        console.log(e);
    }
}

// test();