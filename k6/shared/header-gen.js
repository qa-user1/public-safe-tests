import { settings } from './settings.js'

export function getHeaders(token, orgId, officeId){

        return {
        'Authorization': `Bearer ${token.access}`,
        'Content-Type': `application/json`,
        'Accept': `application/json, text/plain, */*`,
        'Accept-Encoding': `gzip, deflate, br`,
        'Accept-Language': `en-US,en;q=0.9`,
        'officeId': officeId,
        'organizationId': orgId,
        'origin': settings.domain,
        'refreshtoken': token.refresh,
        'deviceId': token.deviceId
    };
}
