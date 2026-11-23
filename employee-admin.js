

/* OTCS EMPLOYEE ADMINISTRATION */

/* ADD EMPLOYEE API */

async function addEmployee(
    employeeName,
    seniorityNumber,
    department,
    prepBoothQualified
) {

    const token = getAdminToken();

    if (!token) {
        throw new Error(
            "Administrator session expired. Please log in again."
        );
    }

    const response = await fetch(
        SUPABASE_FUNCTIONS_URL + "/employee-add",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_PUBLISHABLE_KEY,
                "Authorization": "Bearer " + token
            },

            body: JSON.stringify({
                employee_name: employeeName.trim(),
                seniority_number: seniorityNumber,
                department: department,
                prep_booth_qualified:
                    department === "CI" &&
                    prepBoothQualified === true
            }),

            cache: "no-store"
        }
    );

    const result = await response.json();

    if (response.status === 401) {

        if (getAdminToken() === token) {
            clearAdminSession();
        }

        throw new Error(
            "Administrator session expired. Please log in again."
        );
    }

    if (!response.ok || result.success !== true) {

        throw new Error(
            result.error || "Unable to add employee."
        );
    }

    return result;
}

/* END ADD EMPLOYEE API */

