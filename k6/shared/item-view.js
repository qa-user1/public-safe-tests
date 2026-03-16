import http from 'k6/http';
import { settings } from './settings.js';
import { getHeaders } from './header-gen.js';
import { itemViewTime } from './trend-data.js';


export function viewItem(token){
    let httpHeaders = getHeaders(token, settings.orgId, settings.officeId);
    var response = http.get(`${settings.baseUrl}/api/items/${settings.itemIdToView}?count=false&includePeople=false`, { headers: httpHeaders });   
    if (response.status === 200) {
        console.log(`Item View - response time(ms): ${response.timings.duration}`);     
        itemViewTime.add(response.timings.duration);
    } else {
      console.log(`ERROR retrieving item` + JSON.stringify(response.body));
    }

}
