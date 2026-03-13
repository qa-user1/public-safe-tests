// Paste into console on trackerproducts.com while logged in

(() => {
    const API_BASE = "https://pentestapi.trackerproducts.com";

    const profile = JSON.parse(localStorage.getItem("profile")) || {};
    const token = JSON.parse(localStorage.getItem("token"));
    const refreshToken = JSON.parse(localStorage.getItem("refresh-token"));

    if (!token) throw new Error('❌ localStorage "token" is missing. Log in first.');
    if (!refreshToken) throw new Error('❌ localStorage "refresh-token" is missing. Log in first.');
    if (!profile.organizationId || !profile.officeId) {
        console.warn("⚠️ profile.officeId / profile.organizationId missing in localStorage profile.");
    }

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    function buildHeaders({ hasBody = false } = {}) {
        const h = {
            accept: "application/json, text/plain, */*",
            authorization: `Bearer ${token}`,
            officeid: String(profile.officeId),
            organizationid: String(profile.organizationId),
            refreshtoken: String(refreshToken || ""),
            priority: "u=1, i",
        };
        // IMPORTANT: do NOT set content-type on GET (preflight risk)
        if (hasBody) h["content-type"] = "application/json;charset=UTF-8";
        return h;
    }

    async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), timeoutMs);
        try {
            const res = await fetch(url, {
                ...options,
                signal: ctrl.signal,
                mode: "cors",
                credentials: "include",
            });

            const text = await res.text();
            if (!res.ok) throw new Error(text || `${res.status} ${res.statusText}`);
            if (!text) return null;

            try {
                return JSON.parse(text);
            } catch {
                // some endpoints return plain "true"/"false" without JSON wrapper
                if (text === "true") return true;
                if (text === "false") return false;
                return text;
            }
        } finally {
            clearTimeout(t);
        }
    }

    async function getRoots(pageSize = 500) {
        const requestTime = Date.now();
        const url =
            `${API_BASE}/api/locations/childrenOrRoots` +
            `?hideContainers=false&offset=0&pageSize=${pageSize}&parentLocationId=0&requestTime=${requestTime}`;

        return fetchWithTimeout(url, {
            method: "GET",
            headers: buildHeaders({ hasBody: false }),
        });
    }

    async function isUsed(id) {
        const url = `${API_BASE}/api/locations/isUsed?id=${encodeURIComponent(id)}`;
        return fetchWithTimeout(url, {
            method: "GET",
            headers: buildHeaders({ hasBody: false }),
        });
    }

    async function delLocation(id) {
        const url = `${API_BASE}/api/locations/${encodeURIComponent(id)}`;
        // You said UI sends body {id: xxx}; we include it, but also keep it minimal.
        return fetchWithTimeout(url, {
            method: "DELETE",
            headers: buildHeaders({ hasBody: true }),
            body: JSON.stringify({ id }),
        });
    }

    async function run() {
        const dryRun =
            (prompt('Dry run? Type YES to only report (no delete). Blank = delete.', "") || "")
                .trim()
                .toUpperCase() === "YES";

        const throttleMs = Number(prompt("Throttle between IDs (ms). Default 50", "50") || "50");
        const pageSize = Number(prompt("pageSize for roots (default 500)", "500") || "500");

        console.log("🚀 Starting", { dryRun, throttleMs, pageSize, officeId: profile.officeId, orgId: profile.organizationId });

        console.log("📥 Fetching root locations...");
        const rootsResp = await getRoots(pageSize);
        const locations = rootsResp?.locations || [];
        console.log(`✅ Got ${locations.length} locations`);

        const unused = [];
        const stats = { checked: 0, used: 0, unused: 0, deleted: 0, deleteFailed: 0, isUsedFailed: 0 };

        for (let i = 0; i < locations.length; i++) {
            const id = locations[i]?.id;
            if (!id) continue;

            console.log(`🔎 [${i + 1}/${locations.length}] isUsed id=${id}`);

            let usedVal;
            try {
                usedVal = await isUsed(id);
            } catch (e) {
                stats.isUsedFailed++;
                console.warn(`❌ isUsed failed id=${id}:`, e.message || e);
                continue;
            }

            stats.checked++;

            if (usedVal === true) {
                stats.used++;
                console.log(`✅ USED   id=${id}`);
            } else if (usedVal === false) {
                stats.unused++;
                unused.push(id);
                console.log(`🟡 UNUSED id=${id}`);

                if (!dryRun) {
                    console.log(`🗑️ Deleting id=${id} ...`);
                    try {
                        await delLocation(id);
                        stats.deleted++;
                        console.log(`✅ Deleted id=${id}`);
                    } catch (e) {
                        stats.deleteFailed++;
                        console.warn(`❌ Delete failed id=${id}:`, e.message || e);
                    }
                }
            } else {
                console.warn(`⚠️ Unexpected isUsed response for id=${id}:`, usedVal);
            }

            if (throttleMs > 0) await sleep(throttleMs);
        }

        console.log("🎉 DONE");
        console.table(stats);
        console.log("Unused IDs:", unused);
        window.__loc_cleanup = { stats, unused, locations };
    }

    run().catch((e) => console.error("💥 Script crashed:", e));
})();
