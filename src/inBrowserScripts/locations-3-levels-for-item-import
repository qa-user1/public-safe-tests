// =======================
// API CONFIG & AUTH
// =======================
const API_BASE = 'https://pentestapi.trackerproducts.com';
const profile = JSON.parse(localStorage.getItem('profile')) || {};
const token = JSON.parse(localStorage.getItem('token'));
const refreshToken = JSON.parse(localStorage.getItem('refresh-token'));
console.log('✅ Access token loaded');

// =======================
// API HELPERS
// =======================
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

// =======================
// LOCATION HELPERS
// =======================
async function createParentLoc(parentName) {
    await apiFetchForCurrentOffice('/api/locations', {
        method: 'POST',
        body: JSON.stringify([{ name: parentName, active: true, parentId: 0, canStoreHere: true }])
    });
    console.log(`✅ Root parent created: ${parentName}`);
}

async function findLocationByName(name) {
    const resp = await apiFetchForCurrentOffice(
        `/api/locations/typeahead?accessibleOnly=false&containersOnly=false&hideOverlay=true&nonContainersOnly=false&search=${encodeURIComponent(name)}`
    );
    if (!resp.locations?.length) throw new Error(`❌ Location "${name}" not found`);
    return resp.locations.find(l => l.name === name) || resp.locations[0];
}

async function findLocationByFullPath(fullPath) {
    const resp = await apiFetchForCurrentOffice(
        `/api/locations/typeahead?accessibleOnly=false&containersOnly=false&hideOverlay=true&nonContainersOnly=false&search=${encodeURIComponent(fullPath)}`
    );
    if (!resp.locations?.length) throw new Error(`❌ Location "${fullPath}" not found`);
    return resp.locations.find(l => l.fullPath === fullPath || l.path === fullPath) || resp.locations[0];
}

async function createChildParent(rootParentName, childParentName) {
    await new Promise(r => setTimeout(r, 1000));
    const root = await findLocationByName(rootParentName);

    await apiFetchForCurrentOffice('/api/locations', {
        method: 'POST',
        body: JSON.stringify([{
            name: childParentName,
            active: true,
            parentId: root.id,
            canStoreHere: true
        }])
    });

    console.log(`✅ Child parent created: ${rootParentName}/${childParentName}`);
}

async function createNestedSublocations(rootParent, childParent, subCount) {
    await new Promise(r => setTimeout(r, 1000));
    const fullPath = `${rootParent}/${childParent}`;
    const parent = await findLocationByFullPath(fullPath);

    const payload = [];
    const fullPaths = [];

    for (let i = 1; i <= subCount; i++) {
        const name = `${childParent}_${i}`;
        payload.push({
            name,
            active: true,
            parentId: parent.id,
            canStoreHere: true
        });
        fullPaths.push(`${fullPath}/${name}`);
    }

    await apiFetchForCurrentOffice('/api/locations', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    console.log(`✅ ${subCount} sublocations created under ${fullPath}`);
    return fullPaths;
}

// =======================
// GET FIRST USER GROUP
// =======================
async function getFirstUserGroupId() {
    const groups = await apiFetchForCurrentOffice('/api/usergroups');
    if (!groups?.length) throw new Error('❌ No user groups found');
    return groups[0].id;
}

// =======================
// CREATE CASES
// =======================
async function createCases(numberOfItems, userGroupId) {
    const x = Math.ceil(numberOfItems / 100);
    const cases = [];

    for (let i = 1; i <= x; i++) {
        const caseNumber = `AUTO-${Date.now()}-${i}`;

        const payload = {
            active: true,
            offenseDescription: '',
            offenseTypeId: 674,
            formData: [],
            tags: [],
            reviewDateNotes: '',
            linkedCases: [],
            checkInProgress: false,
            selectedOfficers: {
                items: [{
                    id: userGroupId,
                    text: "Assigned Group",
                    type: "group",
                    typeName: "User Groups",
                    icon: "fa fa-users"
                }]
            },
            caseNumber,
            reviewDate: new Date().toISOString(),
            caseOfficerIds: [],
            caseOfficerGroupIds: [userGroupId]
        };

        const created = await apiFetchForCurrentOffice('/api/cases', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        cases.push({ id: created.id, caseNumber });
        console.log(`✅ Case created: ${caseNumber}`);
    }

    return cases;
}

// =======================
// XLSX LIBRARY CHECK
// =======================
if (!window.XLSX) {
    alert("❌ XLSX library not loaded. Paste xlsx.full.min.js into console first.");
}

// =======================
// GENERATE XLSX
// =======================
async function generateExcelImport(fullSublocationPaths, cases, totalItems) {
    const offices = await apiFetchForCurrentOffice('/api/offices');
    const officeName = offices.find(o => String(o.id) === String(profile.officeId))?.name || '';
    const userSettings = await apiFetchForCurrentOffice(`/api/users/${profile.userId || profile.id}/userSettings`);
    const createdByEmail = userSettings?.email || '';
    const today = new Date().toLocaleDateString('en-US');

    const rows = [];
    let itemCounter = 0;

    while (itemCounter < totalItems) {
        for (const path of fullSublocationPaths) {
            if (itemCounter >= totalItems) break;
            const caseIndex = itemCounter % cases.length;

            rows.push({
                Category: 'Drugs',
                Office: officeName,
                'Storage Location': path,
                Status: 'Checked In',
                CreatedDate: today,
                'Primary Case #': cases[caseIndex].caseNumber,
                CreatedBy: createdByEmail
            });

            itemCounter++;
        }
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Items');
    XLSX.writeFile(wb, 'item_import.xlsx');

    console.log('✅ XLSX import file generated');
}

// =======================
// MAIN FLOW
// =======================
async function run() {
    const rootParent = prompt('Enter ROOT parent location name');
    const childParent = prompt('Enter CHILD parent location name');
    const subCount = Number(prompt('Enter number of sublocations'));
    const totalItems = Number(prompt('Enter total number of items'));

    if (!rootParent || !childParent || !subCount || !totalItems)
        return alert('❌ All inputs required');

    await createParentLoc(rootParent);
    await createChildParent(rootParent, childParent);

    const sublocationPaths = await createNestedSublocations(
        rootParent,
        childParent,
        subCount
    );

    const userGroupId = await getFirstUserGroupId();
    const cases = await createCases(totalItems, userGroupId);

    await generateExcelImport(sublocationPaths, cases, totalItems);

    console.log('🎉 DONE: Nested locations, cases & XLSX ready');
}

run();
