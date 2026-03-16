import { createLocation, findLocation, updateLocation } from './locations-helper.js';

export function createAndUpdateLocation (virtualUserIndex, token) {
    // Create Location
    let createdLocationName = createLocation(virtualUserIndex, token);
    
    if(!createdLocationName) {
		console.log('location not found');
		return;
	}

    // Update Location #1
    let foundLocation = findLocation(virtualUserIndex, token, createdLocationName);

    if (foundLocation && foundLocation.locations) {
        var location = foundLocation.locations[0];

        var updatedLocationName = updateLocation(virtualUserIndex, token, location);
    }
}