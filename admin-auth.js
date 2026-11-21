
/* OTCS ADMINISTRATOR AUTHENTICATION */

let adminSessionToken = null;
let adminSessionExpiresAt = 0;


/* ADMINISTRATOR LOGIN */

async function adminLogin(pin) {

    if (typeof pin !== "string" || !/^\d{4}$/.test(pin)) {
        throw new Error("Please enter a four-digit PIN.");
    }

    const response = await fetch(
        SUPABASE_FUNCTIONS_URL + "/admin-login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_PUBLISHABLE_KEY
            },
            body: JSON.stringify({ pin: pin }),
            cache: "no-store"
        }
    );

    const result = await response.json();

    if (!response.ok || result.success !== true) {
        throw new Error(
            result.error || "Administrator login failed."
        );
    }

    if (
        typeof result.token !== "string" ||
        !/^[a-f0-9]{64}$/.test(result.token) ||
        result.expires_in !== 28800
    ) {
        throw new Error("Invalid session response.");
    }

    adminSessionToken = result.token;

    adminSessionExpiresAt =
        Date.now() + result.expires_in * 1000;

    return true;
}


/* CHECK LOCAL ADMINISTRATOR SESSION */

function hasAdminSession() {

    if (
        !adminSessionToken ||
        Date.now() >= adminSessionExpiresAt
    ) {
        clearAdminSession();
        return false;
    }

    return true;
}


/* RETRIEVE SESSION TOKEN */

function getAdminToken() {

    if (!hasAdminSession()) {
        return null;
    }

    return adminSessionToken;
}


/* CLEAR LOCAL ADMINISTRATOR SESSION */

function clearAdminSession() {

    adminSessionToken = null;
    adminSessionExpiresAt = 0;
}
