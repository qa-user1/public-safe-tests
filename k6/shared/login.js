import http from 'k6/http';
import {settings} from './settings.js';
import { loginTime } from './trend-data.js'

export function logIn(virutalUserIndex, token, csvData) {

    let user = csvData[virutalUserIndex - 1];

    if (!token.access) {
        console.log(`baseUrl: ${settings.baseUrl} username: ${user.username} pw: ${user.password}`);

        var response = http.post(`${settings.baseUrl}/token`, {
                username: user.username,
                password: user.password,
                grant_type: 'password'
            },
            {
                headers: {
                    'kick-out-user': 'true'
                }
            });

        var jsonData = JSON.parse(response.body);

        if (jsonData.refresh_token) {

            token.access = jsonData.access_token;
            token.refresh = jsonData.refresh_token;
            token.deviceId = jsonData.deviceId;
            console.log(`user ${user.username} logged in SUCCESS`);
            loginTime.add(response.timings.duration);
        } else {
			var error = JSON.stringify(jsonData);
            console.log(`user ${user.username} login FAILED: ${error} `);
        }
    } else {
        // console.log(`user ${user.username} is already logged in`);
    }
}


