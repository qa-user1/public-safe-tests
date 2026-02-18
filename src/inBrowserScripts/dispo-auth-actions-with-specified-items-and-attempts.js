// =======================
// API CONFIG & AUTH
// =======================
const API_BASE = 'https://pentestapi.trackerproducts.com';

// CURRENT LOGGED-IN USER (normal flow)
const profile = JSON.parse(localStorage.getItem('profile')) || {};
const token = JSON.parse(localStorage.getItem('token'));
const refreshToken = JSON.parse(localStorage.getItem('refresh-token'));

// STATIC USER TOKEN (for reject only)
const staticToken = 'PUT_STATIC_TOKEN_HERE'; // <-- SET THIS

if (!token) throw new Error('❌ Missing token in localStorage');
console.log('✅ Access token loaded');

// =======================
// HARD-CODED TASK CONFIG
// =======================
const TASK_TITLE = 'Disposition Authorization';
const TASK_MESSAGE = 'Message-forAutomatedTests';
const DEFAULT_DUE_DAYS = 7;

// TaskType name to look up dynamically
const TASK_TYPE_NAME = 'Disposition Authorization';

// OffenseType name to look up dynamically (optional).
// If null/not found -> fallback to first ACTIVE offense type.
const OFFENSE_TYPE_NAME = null; // e.g. "Burglary"

// Category name to look up dynamically for item creation
const CATEGORY_NAME = 'Accessory';

// =======================
// DISPO AUTH CONFIG
// =======================
let DISPO_ACTION_ID = 2; // set via prompt
const DISPO_BATCH_SIZE = 200;

// =======================
// SUBMIT RETRY CONFIG
// =======================
const SUBMIT_RETRY_DELAY_MS = 10_000; // 10 seconds
const SUBMIT_MAX_ATTEMPTS = 3;

// =======================
// REJECT CONFIG
// =======================
const REJECT_NOTE = 'test';
let PAUSE_BEFORE_REJECT_SECONDS = 0; // set via prompt

// =======================
// ITEM FIELDS ENDPOINT ORG ID (ALWAYS 1)
// =======================
const ORG_ID_FOR_FIELDS_ENDPOINT = 1;

// Payload must remain stable (use whatever you want enforced).
// NOTE: In your UI example, orgFieldId 20/36 weren't included. If you need them, keep them here.
const ITEM_FIELDS_PAYLOAD = [
    {"orgFieldId":20,"entityType":1,"name":"ITEM_RECOVERED_AT","recordType":1},
    {"orgFieldId":20,"entityType":1,"name":"ITEM_RECOVERED_AT","recordType":0},
    {"orgFieldId":21,"entityType":1,"name":"ITEM_CUSTODY_REASON","recordType":1},
    {"orgFieldId":23,"entityType":1,"name":"ITEM_RECOVERED_BY","recordType":1},
    {"orgFieldId":24,"entityType":1,"name":"ITEM_MAKE","recordType":1},
    {"orgFieldId":25,"entityType":1,"name":"ITEM_MODEL","recordType":1},
    {"orgFieldId":26,"entityType":1,"name":"ITEM_SERIAL_NUMBER","recordType":1},
    {"orgFieldId":27,"entityType":1,"name":"ITEM_BARCODES","recordType":1},
    {"orgFieldId":28,"entityType":1,"name":"GENERAL.TAGS","recordType":1},
    {"orgFieldId":36,"entityType":1,"name":"ITEM_DESCRIPTION","recordType":0},
    {"orgFieldId":37,"entityType":1,"name":"ITEM_RECOVERY_DATE","recordType":1},
    {"orgFieldId":37,"entityType":1,"name":"ITEM_RECOVERY_DATE","recordType":0},
    {"orgFieldId":38,"entityType":1,"name":"PEOPLE.ITEM_BELONGS_TO","recordType":1},
    {"orgFieldId":38,"entityType":1,"name":"PEOPLE.ITEM_BELONGS_TO","recordType":0},
    {"orgFieldId":41,"entityType":1,"name":"ITEM.EXPECTED_RETURN_DATE","recordType":1},
    {"orgFieldId":42,"entityType":1,"name":"ITEMS.DISPOSAL.ACTUAL_DISPOSED_DATE","recordType":1},
    {"orgFieldId":43,"entityType":1,"name":"ITEM.CHECKINNOTES","recordType":1},
    {"orgFieldId":46,"entityType":1,"name":"ITEM.PUBLIC_FACING_DESCRIPTION","recordType":1},
    {"orgFieldId":47,"entityType":1,"name":"ITEMS.DISPOSAL.RELEASED_TO","recordType":1},
    {"orgFieldId":47,"entityType":1,"name":"ITEMS.DISPOSAL.RELEASED_TO","recordType":0},
    {"orgFieldId":48,"entityType":1,"name":"ITEM.LATEST_TRANSACTION_NOTES","recordType":1},
    {"orgFieldId":50,"entityType":1,"name":"ITEM.CHECKIN_SIGNATURE","recordType":1}
];

// =======================
// URL BUILDER (prevents localhost/relative issues)
// =======================
function buildUrl(pathOrUrl) {
    if (!pathOrUrl) throw new Error('❌ Empty path/url');
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return `${API_BASE}${p}`;
}

// =======================
// HELPERS (NORMAL USER)
// =======================
async function apiFetchForCurrentOffice(pathOrUrl, options = {}) {
    const res = await fetch(buildUrl(pathOrUrl), {
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

async function apiFetchForCurrentOfficeSafe(pathOrUrl, options = {}) {
    const res = await fetch(buildUrl(pathOrUrl), {
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
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    return { ok: res.ok, status: res.status, data };
}

// =======================
// HELPERS (STATIC USER – REJECT ONLY)
// =======================
async function apiFetchWithStaticToken(pathOrUrl, options = {}) {
    if (!staticToken || staticToken === 'PUT_STATIC_TOKEN_HERE') {
        throw new Error('❌ staticToken is not set. Put a valid token in staticToken variable.');
    }

    const res = await fetch(buildUrl(pathOrUrl), {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${staticToken}`,
            'StaticToken': true,
            'Organizationid': profile.organizationId,
            'Officeid': profile.officeId,
            ...(options.headers || {})
        }
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text || res.statusText);
    return text ? JSON.parse(text) : {};
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

function generateLocationName() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${mm}-${dd}-${yy}-${rand}`;
}

function extractTaskId(resp) {
    if (typeof resp === 'number') return resp;
    if (typeof resp === 'string' && /^\d+$/.test(resp)) return Number(resp);
    return Number(resp?.id || resp?.taskId || null) || null;
}

function getCurrentUserId() {
    const id = Number(profile.userId || profile.id);
    if (!id) throw new Error('❌ Cannot resolve current user id');
    return id;
}

function generateRandomDescription() {
    return `AUTO-DESC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

// =======================
// LOOKUP TASK TYPE ID BY NAME
// =======================
async function getTaskTypeIdByName(name) {
    const types = await apiFetchForCurrentOffice('/api/TaskTypes');
    if (!Array.isArray(types)) throw new Error('❌ Unexpected /api/TaskTypes response');

    let match = types.find(t => t?.name === name);
    if (!match) match = types.find(t => String(t?.name || '').toLowerCase() === String(name).toLowerCase());

    if (!match?.id) throw new Error(`❌ TaskType not found by name "${name}"`);
    console.log(`✅ TaskType resolved: "${match.name}" => id=${match.id}`);
    return match.id;
}

// =======================
// LOOKUP OFFENSE TYPE ID
// =======================
async function getOffenseTypeId() {
    const offenseTypes = await apiFetchForCurrentOffice('/api/offenseTypes?belongToOrganization=true');
    if (!Array.isArray(offenseTypes) || offenseTypes.length === 0) {
        throw new Error('❌ No offense types returned from /api/offenseTypes');
    }

    const active = offenseTypes.filter(o => o && o.active);
    let chosen = null;

    if (OFFENSE_TYPE_NAME && String(OFFENSE_TYPE_NAME).trim()) {
        const name = String(OFFENSE_TYPE_NAME).trim();
        chosen =
            active.find(o => o.name === name) ||
            active.find(o => String(o.name || '').toLowerCase() === name.toLowerCase()) ||
            offenseTypes.find(o => o.name === name) ||
            offenseTypes.find(o => String(o.name || '').toLowerCase() === name.toLowerCase());
    }

    if (!chosen) chosen = active[0] || offenseTypes[0];
    if (!chosen?.id) throw new Error('❌ Could not resolve offenseTypeId');

    console.log(`✅ OffenseType selected: id=${chosen.id}, name="${chosen.name}"`);
    return chosen.id;
}

// =======================
// LOOKUP CATEGORY ID (Accessory)
// =======================
async function getCategoryIdByName(name) {
    const categories = await apiFetchForCurrentOffice('/api/categories?belongToOrganization=true');
    if (!Array.isArray(categories) || categories.length === 0) {
        throw new Error('❌ No categories returned from /api/categories');
    }

    const exact =
        categories.find(c => c?.name === name) ||
        categories.find(c => String(c?.name || '').toLowerCase() === String(name).toLowerCase());

    if (!exact?.id) throw new Error(`❌ Category not found by name "${name}"`);

    console.log(`✅ Category resolved: "${exact.name}" => id=${exact.id}`);
    return exact.id;
}

// =======================
// APPLY ITEM FIELD CONFIG (ALWAYS /organizations/1/fields)
// =======================
async function applyItemFieldsConfiguration() {
    await apiFetchForCurrentOffice(`/api/organizations/${ORG_ID_FOR_FIELDS_ENDPOINT}/fields`, {
        method: 'POST',
        body: JSON.stringify(ITEM_FIELDS_PAYLOAD)
    });
    console.log(`✅ Item field configuration applied via /organizations/${ORG_ID_FOR_FIELDS_ENDPOINT}/fields`);
}

// =======================
// LOCATION
// =======================
async function createAndResolveLocation() {
    const name = generateLocationName();

    await apiFetchForCurrentOffice('/api/locations', {
        method: 'POST',
        body: JSON.stringify([{ name, active: true, parentId: 0, canStoreHere: true }])
    });

    await sleep(1000);

    const resp = await apiFetchForCurrentOffice(
        `/api/locations/typeahead?accessibleOnly=false&containersOnly=false&hideOverlay=true&nonContainersOnly=false&search=${encodeURIComponent(name)}`
    );

    const loc = resp.locations?.find(l => l.name === name) || resp.locations?.[0];
    if (!loc?.id) throw new Error('❌ Failed to resolve location');

    console.log(`📍 Location created: ${name} (id=${loc.id})`);
    return loc;
}

// =======================
// CASE + ITEMS
// =======================
async function getFirstUserGroupId() {
    const groups = await apiFetchForCurrentOffice('/api/usergroups');
    if (!groups?.length) throw new Error('❌ No user groups found');
    return groups[0].id;
}

async function createCase(userGroupId, offenseTypeId) {
    const created = await apiFetchForCurrentOffice('/api/cases', {
        method: 'POST',
        body: JSON.stringify({
            active: true,
            offenseTypeId,
            caseNumber: `AUTO-${Date.now()}`,
            reviewDate: new Date().toISOString(),
            selectedOfficers: {
                items: [{
                    id: userGroupId,
                    text: 'Assigned Group',
                    type: 'group',
                    typeName: 'User Groups',
                    icon: 'fa fa-users'
                }]
            },
            caseOfficerGroupIds: [userGroupId]
        })
    });

    if (!created?.id) throw new Error('❌ Case created but no id returned');
    console.log(`✅ Case created (id=${created.id})`);
    return created.id;
}

async function createItems(x, caseId, locationId, categoryId) {
    const ids = [];

    for (let i = 0; i < x; i++) {
        const created = await apiFetchForCurrentOffice('/api/items', {
            method: 'POST',
            body: JSON.stringify({
                active: true,
                description: generateRandomDescription(),
                statusId: 1,
                categoryId,
                locationId,
                primaryCaseId: caseId,
                barcodes: [{ id: 0, value: '' }]
            })
        });

        if (!created?.id) throw new Error('❌ Item created but no id returned');
        ids.push(created.id);
    }

    console.log(`📦 Items created: ${ids.length}`);
    return ids;
}

// =======================
// TASK TEMPLATE + TASK
// =======================
async function getTaskTemplateByTaskTypeId(taskTypeId) {
    const templates = await apiFetchForCurrentOffice('/api/taskTemplates');
    if (!Array.isArray(templates)) throw new Error('❌ Unexpected /api/taskTemplates response');

    const match =
        templates.find(t => Number(t.taskTypeId) === Number(taskTypeId) && t.active) ||
        templates.find(t => Number(t.taskType?.id) === Number(taskTypeId) && t.active) ||
        templates.find(t => Number(t.taskTypeId) === Number(taskTypeId)) ||
        templates.find(t => Number(t.taskType?.id) === Number(taskTypeId));

    if (!match) throw new Error(`❌ Task template for taskTypeId=${taskTypeId} not found`);
    console.log(`✅ Task template selected: id=${match.id}, title="${match.title}"`);
    return match;
}

async function createTask(taskTemplate, itemIds) {
    const creatorId = getCurrentUserId();

    const resp = await apiFetchForCurrentOffice('/api/tasks/saveNewTask', {
        method: 'POST',
        body: JSON.stringify({
            title: TASK_TITLE,
            message: TASK_MESSAGE,
            creatorId,
            assignedUserIds: [creatorId],
            userGroupIds: [],
            taskAttachments: itemIds.map(id => ({
                taskId: null,
                entityId: id,
                entityType: 1,
                taskActions: []
            })),
            dueDate: new Date(Date.now() + DEFAULT_DUE_DAYS * 86400000).toISOString(),
            taskTemplateId: taskTemplate.id
        })
    });

    const taskId = extractTaskId(resp);
    if (!taskId) throw new Error('❌ Task ID not returned from saveNewTask');

    console.log(`✅ Task created (taskId=${taskId})`);
    return taskId;
}

// =======================
// DISPO AUTH
// =======================
async function updateDispoAuthActionForItems({ itemIds, taskId }) {
    const disposeAfterDate = new Date().toISOString();

    for (const batch of chunk(itemIds, DISPO_BATCH_SIZE)) {
        await apiFetchForCurrentOffice('/api/dispositionAuthorization/updateDispoAuthAction', {
            method: 'POST',
            body: JSON.stringify({
                itemIds: batch,
                disposeAfterDate,
                holdUntilDate: null,
                releaseAfterDate: null,
                setTaskForResubmit: false,
                taskId,
                actionId: DISPO_ACTION_ID
            })
        });
    }

    console.log(`✅ DispoAuth actionId=${DISPO_ACTION_ID} set for ${itemIds.length} items`);
}

// =======================
// SUBMIT TASK (retry after 10s, max 3 attempts, only for queue message)
// =======================
async function submitTaskWithRetry(taskId) {
    for (let attemptNo = 1; attemptNo <= SUBMIT_MAX_ATTEMPTS; attemptNo++) {
        const res = await apiFetchForCurrentOfficeSafe(`/api/tasks/submit/${taskId}`, { method: 'POST' });

        if (res.ok) {
            console.log(`🚀 Task submitted (taskId=${taskId}) [attempt ${attemptNo}]`);
            return;
        }

        const msg =
            typeof res.data === 'object' && res.data?.message
                ? res.data.message
                : String(res.data || '');

        const isQueueMsg = msg.includes('Task is already in Disposition Actions Jobs Queue');

        if (isQueueMsg && attemptNo < SUBMIT_MAX_ATTEMPTS) {
            console.warn(`⚠️ Submit blocked (attempt ${attemptNo}/${SUBMIT_MAX_ATTEMPTS}): "${msg}". Retrying in 10 seconds...`);
            await sleep(SUBMIT_RETRY_DELAY_MS);
            continue;
        }

        throw new Error(typeof res.data === 'object' ? JSON.stringify(res.data) : msg);
    }
}

// =======================
// REJECT DISPO AUTH (STATIC USER)
// =======================
async function rejectDispositionAuthorization(taskId, itemIds) {
    await apiFetchWithStaticToken('/api/dispositionAuthorization/rejectDispositionAuthorization/', {
        method: 'POST',
        body: JSON.stringify({
            taskId: String(taskId),
            itemIds,
            note: REJECT_NOTE
        })
    });

    console.log(`⛔ Rejected Dispo Auth (static user) taskId=${taskId}`);
}

// =======================
// MASS CLOSE
// =======================
async function massCloseTask(taskId, itemIds) {
    await apiFetchForCurrentOffice('/api/tasks/massCloseTasks', {
        method: 'POST',
        body: JSON.stringify({
            ids: [taskId],
            isClosed: true,
            underReviewItemIds: itemIds
        })
    });

    console.log(`🔒 Task closed (taskId=${taskId})`);
}

// =======================
// MAIN CYCLE
// =======================
async function runOneTaskCycle(taskTemplate, itemIds, cycleNo, totalCycles) {
    console.log(`\n=======================\n🔁 Cycle ${cycleNo}/${totalCycles}\n=======================`);

    const taskId = await createTask(taskTemplate, itemIds);

    await updateDispoAuthActionForItems({ itemIds, taskId });
    await submitTaskWithRetry(taskId);

    if (PAUSE_BEFORE_REJECT_SECONDS > 0) {
        console.log(`⏳ Waiting ${PAUSE_BEFORE_REJECT_SECONDS}s before REJECT...`);
        await sleep(PAUSE_BEFORE_REJECT_SECONDS * 1000);
    }

    await rejectDispositionAuthorization(taskId, itemIds);
    await massCloseTask(taskId, itemIds);

    console.log(`✅ Cycle ${cycleNo} done (taskId=${taskId})`);
    return taskId;
}

// =======================
// MAIN
// =======================
(async function run() {
    try {
        const itemCount = Number(prompt('Enter number of items to create (X)'));
        if (!Number.isInteger(itemCount) || itemCount <= 0) return alert('❌ Invalid item count');

        const cycles = Number(prompt('Enter how many times to repeat the task cycle (R)'));
        if (!Number.isInteger(cycles) || cycles <= 0) return alert('❌ Invalid repeat count');

        const actionChoice = Number(prompt(
            'Choose Disposition Action:\n' +
            '1 = Approve for Disposal\n' +
            '2 = Timed Disposal'
        ));
        if (![1, 2].includes(actionChoice)) return alert('❌ Disposition Action must be 1 or 2');
        DISPO_ACTION_ID = actionChoice;

        PAUSE_BEFORE_REJECT_SECONDS = Number(
            prompt('Enter pause in seconds BEFORE Reject Disposition Authorization (0 = no pause)')
        );
        if (!Number.isInteger(PAUSE_BEFORE_REJECT_SECONDS) || PAUSE_BEFORE_REJECT_SECONDS < 0) {
            return alert('❌ Pause before reject must be 0 or a positive integer');
        }

        // Resolve dynamic IDs
        const taskTypeId = await getTaskTypeIdByName(TASK_TYPE_NAME);
        const offenseTypeId = await getOffenseTypeId();
        const categoryId = await getCategoryIdByName(CATEGORY_NAME);

        // Create location + case + apply fields + items ONCE
        const location = await createAndResolveLocation();
        const caseId = await createCase(await getFirstUserGroupId(), offenseTypeId);

        // ✅ Apply item field configuration BEFORE creating items
        await applyItemFieldsConfiguration();

        const itemIds = await createItems(itemCount, caseId, location.id, categoryId);

        // Pause ONLY ONCE: after items and before the FIRST saveTask (equals itemCount)
        console.log(`⏳ Waiting ${itemCount}s before first task creation...`);
        await sleep(itemCount * 1000);

        // Fetch template using dynamic taskTypeId
        const template = await getTaskTemplateByTaskTypeId(taskTypeId);

        const taskIds = [];
        for (let i = 1; i <= cycles; i++) {
            const tid = await runOneTaskCycle(template, itemIds, i, cycles);
            taskIds.push(tid);
        }

        console.log('\n🎉 DONE');
        console.log({
            taskTypeName: TASK_TYPE_NAME,
            taskTypeId,
            offenseTypeId,
            categoryName: CATEGORY_NAME,
            categoryId,
            dispoActionId: DISPO_ACTION_ID,
            pauseBeforeRejectSeconds: PAUSE_BEFORE_REJECT_SECONDS,
            locationName: location.name,
            locationId: location.id,
            caseId,
            items: itemIds.length,
            taskIds
        });
    } catch (e) {
        console.error(e);
        alert(e.message || String(e));
    }
})();
