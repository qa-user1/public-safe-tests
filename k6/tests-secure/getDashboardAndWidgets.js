
import { sleep } from 'k6';
import { GetDashboard, GetMyDataWidgets, GetItemsByCategoryOrg, GetItemsByCategoryUser, GetNewItems, GetInAndDisposedItems,
    GetItemsByStatus, GetItemsByStatusUser, GetStatsCalcBulk } from '../helpers/secure/dashboard-helper-secure.js';

export function getDashboardAndWidgets (virtualUserIndex, token) {
    
    GetDashboard(virtualUserIndex, token);
    sleep(1);

    GetMyDataWidgets(virtualUserIndex, token);

    GetItemsByCategoryOrg(virtualUserIndex, token);

    GetItemsByCategoryUser(virtualUserIndex, token);

    GetNewItems(virtualUserIndex, token);

    GetInAndDisposedItems(virtualUserIndex, token);

    GetItemsByStatus(virtualUserIndex, token);

    GetItemsByStatusUser(virtualUserIndex, token);

    GetStatsCalcBulk(virtualUserIndex, token);

    console.log("Finished Getting Dashboard And Widgets");
}