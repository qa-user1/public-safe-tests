import http from 'k6/http';
import { settings } from './settings.js';
import { getHeaders } from './header-gen.js';
import { caseViewTime } from './trend-data.js';


export function viewCase(token){
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
    var response = http.get(`${settings.baseUrl}/api/cases/${settings.caseIdToView}`, { headers: httpHeaders });   
    if (response.status === 200) {
        console.log(`Case View - response time(ms): ${response.timings.duration}`);     
        caseViewTime.add(response.timings.duration);
    } else {
      console.log(`ERROR retrieving case` + JSON.stringify(response.body));
    }

}

