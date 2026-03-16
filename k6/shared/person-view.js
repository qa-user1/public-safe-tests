import http from 'k6/http';
import { settings } from './settings.js';
import { getHeaders } from './header-gen.js';
import { personViewTime } from './trend-data.js';


export function viewPerson(token){
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
    var response = http.get(`${settings.baseUrl}/api/people/${settings.personIdToView}`, { headers: httpHeaders });   
    if (response.status === 200) {
        console.log(`Person View - response time(ms): ${response.timings.duration}`);     
        personViewTime.add(response.timings.duration);
    } else {
      console.log(`ERROR retrieving person` + JSON.stringify(response.body));
    }

}
