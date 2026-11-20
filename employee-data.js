/* MTA Work Equipment OT Call List */
/* Live Employee Data Retrieval */

async function loadEmployees() {

    const url = SUPABASE_REST_URL +
        "/employees?select=" +
        "id,employee_name,seniority_number," +
        "department,prep_booth_qualified,active," +
        "ci_ot_hours,painter_ot_hours" +
        "&active=eq.true" +
        "&order=seniority_number.asc";

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "apikey": SUPABASE_PUBLISHABLE_KEY
        },
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(
            "Unable to load employees. HTTP " +
            response.status
        );
    }

    const records = await response.json();

    const groupedEmployees = {
        ci: [],
        painters: [],
        cta: []
    };

    records.forEach(record => {

        const employee = {
            id: record.id,
            name: record.employee_name,
            seniority: record.seniority_number,
            department: record.department,
            prep: record.prep_booth_qualified
        };

        if (record.department === "CI") {

            employee.hours = Number(
                record.ci_ot_hours ?? 0
            );

            groupedEmployees.ci.push(employee);

        } else if (record.department === "Painter") {

            employee.hours = Number(
                record.painter_ot_hours ?? 0
            );

            groupedEmployees.painters.push(employee);

        } else if (record.department === "CTA") {

            groupedEmployees.cta.push(employee);

        } else {

            console.warn(
                "Unrecognized employee department:",
                record.department
            );

        }

    });

    return groupedEmployees;
}
