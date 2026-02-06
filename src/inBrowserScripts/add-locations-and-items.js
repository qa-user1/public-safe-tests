// =======================
// API CONFIG
// =======================
const API_BASE = 'https://pentestapi.trackerproducts.com';

/* =======================
   AUTH / CONTEXT
======================= */
const profile = JSON.parse(localStorage.getItem('profile')) || {};
const token = JSON.parse(localStorage.getItem('token'));
const refreshToken = JSON.parse(localStorage.getItem('refresh-token'));
console.log('✅ Access token loaded');

/* =======================
   API HELPERS
======================= */
async function apiFetchForCurrentOffice(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refreshtoken': `${refreshToken}`,
            'Organizationid': profile.organizationId,
            'Officeid': profile.officeId,
            ...(options.headers || {})
        }
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text || res.statusText);
    return text ? JSON.parse(text) : {};
}

/* =======================
   FIND PARENT LOCATION
======================= */
async function findParentLocationByName(parentName) {
    const response = await apiFetchForCurrentOffice(
        `/api/locations/typeahead?accessibleOnly=false&containersOnly=false&hideOverlay=true&nonContainersOnly=false&search=${encodeURIComponent(parentName)}`
    );

    if (!response.locations?.length) {
        throw new Error(`❌ Parent location "${parentName}" not found`);
    }

    const exact = response.locations.find(l => l.name === parentName);
    if (!exact) throw new Error(`❌ Exact match not found for "${parentName}"`);

    return exact;
}

/* =======================
   FIND SUBLOCATION BY FULL PATH
======================= */
async function findSublocationByFullPath(parentName, subName) {
    const fullPath = `${parentName}/${subName}`;

    const response = await apiFetchForCurrentOffice(
        `/api/locations/typeahead?accessibleOnly=false&containersOnly=false&hideOverlay=true&nonContainersOnly=false&search=${encodeURIComponent(fullPath)}`
    );

    if (!response.locations?.length) {
        throw new Error(`❌ Sublocation not found by path "${fullPath}"`);
    }

    const exact = response.locations.find(loc => loc.path === fullPath);
    if (!exact) throw new Error(`❌ Exact path match not found for "${fullPath}"`);

    return exact;
}

/* =======================
   CREATE PARENT LOCATION
======================= */
async function createParentLoc(parentName) {
    await apiFetchForCurrentOffice('/api/locations', {
        method: 'POST',
        body: JSON.stringify([{
            name: parentName,
            active: true,
            parentId: 0,
            canStoreHere: true
        }]),
        mode: 'cors',
        credentials: 'include'
    });

    console.log(`✅ Parent location created: ${parentName}`);
}

/* =======================
   CREATE SUBLOCATIONS
======================= */
async function createSublocations(parentName, subCount) {
    await new Promise(r => setTimeout(r, 1000)); // indexing delay

    const parent = await findParentLocationByName(parentName);
    const payload = [];

    for (let i = 1; i <= subCount; i++) {
        payload.push({
            name: `${parentName}_${i}`,
            active: true,
            parentId: parent.id,
            canStoreHere: true
        });
    }

    await apiFetchForCurrentOffice('/api/locations', {
        method: 'POST',
        body: JSON.stringify(payload),
        mode: 'cors',
        credentials: 'include'
    });

    console.log(`✅ ${subCount} sublocations created`);
    return payload.map(p => p.name);
}

/* =======================
   CREATE ITEMS FOR LOCATION
======================= */
async function createItemsForLocation(locationId, itemCount, primaryCaseId) {
    for (let i = 1; i <= itemCount; i++) {
        const itemPayload = {
            description: '',
            active: true,
            statusId: 1,
            categoryId: 138,
            recoveryLocation: '',
            locationId,
            recoveryDate: null,
            barcodes: [{ id: 0, value: '' }],
            formData: [],
            cases: [],
            tags: [],
            people: [],
            isNewItemCheckout: false,
            checkoutNotes: null,
            checkoutExpectedReturnDate: null,
            checkoutSignature: null,
            dispositionAuthorizationStatusId: 1,
            primaryCaseId,
            peopleIds: [],
            checkInSignature: null
        };

        await apiFetchForCurrentOffice('/api/items', {
            method: 'POST',
            body: JSON.stringify(itemPayload),
            mode: 'cors',
            credentials: 'include'
        });
    }

    console.log(`📦 ${itemCount} items created for location ${locationId}`);
}

/* =======================
   MAIN FLOW (ORDERED PROMPTS)
======================= */
async function run() {
    const parentName = prompt('Enter Parent Location name');
    if (!parentName || !parentName.trim()) {
        alert('❌ Parent location name is required');
        return;
    }

    const subCount = Number(prompt('Enter number of sublocations')?.trim());
    const itemCount = Number(prompt('Enter number of items per sublocation')?.trim());
    const primaryCaseId = Number(prompt('Enter Primary Case ID')?.trim());

    if (
        !Number.isInteger(subCount) || subCount <= 0 ||
        !Number.isInteger(itemCount) || itemCount <= 0 ||
        !Number.isInteger(primaryCaseId) || primaryCaseId <= 0
    ) {
        alert('❌ Invalid numeric input');
        return;
    }

    const cleanParentName = parentName.trim();

    await createParentLoc(cleanParentName);

    const sublocationNames = await createSublocations(cleanParentName, subCount);

    // allow indexing for sublocations
    await new Promise(r => setTimeout(r, 1000));

    for (const subName of sublocationNames) {
        const subLoc = await findSublocationByFullPath(cleanParentName, subName);
        await createItemsForLocation(subLoc.id, itemCount, primaryCaseId);
    }

    console.log('🎉 DONE: Parent, sublocations, and items successfully created');
}

/* =======================
   RUN
======================= */
run();