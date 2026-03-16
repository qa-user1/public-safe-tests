import http from 'k6/http';
import { settings } from '../settings.js';
import { getHeaders } from '../shared/header-gen.js';


export function threadPool (virtualUserIndex, token) {

    let httpHeaders = getHeaders(token, 1, 1);
    var response = http.get(`${settings.baseUrl}/api/threadpool`, { headers: httpHeaders });

    if (response.status === 200) {
      console.log(`ThreadPool - ${response.body} response time(ms): ${response.timings.duration}`);    
    } else {
      console.log(`ERROR retrieving thread pool stats `);
    }

}
