// =====================================================
// CIVICPULSE - HACKDAY 1.0
// Smart Civic Issue Reporting Platform
// =====================================================


// ================= GLOBAL DATA =================

let reports = JSON.parse(localStorage.getItem("civicPulseReports")) || [];


// ================= INITIAL DEMO DATA =================

if (reports.length === 0) {

    reports = [
        {
            id: 1,
            category: "Pothole",
            location: "FC Road, Pune",
            severity: "high",
            description: "Large pothole affecting traffic",
            score: 87,
            priority: "HIGH",
            status: "Pending"
        },
        {
            id: 2,
            category: "Water Leakage",
            location: "Kothrud, Pune",
            severity: "high",
            description: "Water leakage on main road",
            score: 82,
            priority: "HIGH",
            status: "Pending"
        },
        {
            id: 3,
            category: "Garbage Overflow",
            location: "Wakad, Pune",
            severity: "medium",
            description: "Overflowing garbage bin",
            score: 64,
            priority: "MEDIUM",
            status: "Pending"
        },
        {
            id: 4,
            category: "Broken Streetlight",
            location: "Baner, Pune",
            severity: "medium",
            description: "Streetlight not working",
            score: 58,
            priority: "MEDIUM",
            status: "In Progress"
        }
    ];

    saveReports();
}


// ================= SAVE DATA =================

function saveReports() {

    localStorage.setItem(
        "civicPulseReports",
        JSON.stringify(reports)
    );
}


// ================= SCROLL =================

function scrollToSection(id) {

    const section = document.getElementById(id);

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }
}


// ================= REPORT MODAL =================

function openReportModal() {

    const modal = document.getElementById("reportModal");

    modal.classList.add("active");

    document.body.style.overflow = "hidden";
}


function closeReportModal() {

    const modal = document.getElementById("reportModal");

    modal.classList.remove("active");

    document.body.style.overflow = "auto";
}


// ================= SUCCESS MODAL =================

function closeSuccessModal() {

    document.getElementById("successModal")
        .classList.remove("active");

    document.body.style.overflow = "auto";
}


// ================= PRIORITY CALCULATION =================

function calculatePriority() {

    const category =
        document.getElementById("issueCategory").value;

    const severityElement =
        document.querySelector(
            'input[name="severity"]:checked'
        );

    const scoreBox =
        document.getElementById("smartScoreBox");

    const scoreElement =
        document.getElementById("calculatedScore");

    const labelElement =
        document.getElementById("priorityLabel");


    if (!category || !severityElement) {

        scoreElement.textContent = "--";

        labelElement.textContent =
            "Complete the form";

        return;

    }


    const severity =
        severityElement.value;


    // Base severity score

    let score = 0;

    if (severity === "low") {
        score += 30;
    }

    if (severity === "medium") {
        score += 50;
    }

    if (severity === "high") {
        score += 75;
    }


    // Category impact score

    const categoryImpact = {

        pothole: 12,
        garbage: 8,
        streetlight: 5,
        water: 10,
        manhole: 15

    };


    score += categoryImpact[category] || 5;


    // Keep score within 100

    score = Math.min(score, 100);


    let priority = "LOW";


    if (score >= 80) {

        priority = "CRITICAL";

    } else if (score >= 65) {

        priority = "HIGH";

    } else if (score >= 45) {

        priority = "MEDIUM";

    }


    scoreElement.textContent = score;

    labelElement.textContent =
        priority + " PRIORITY";


    // Dynamic visual state

    if (priority === "CRITICAL") {

        labelElement.style.background = "#fff0f0";
        labelElement.style.color = "#ef4444";

    } else if (priority === "HIGH") {

        labelElement.style.background = "#fff0f0";
        labelElement.style.color = "#ef4444";

    } else if (priority === "MEDIUM") {

        labelElement.style.background = "#fff6e6";
        labelElement.style.color = "#f59e0b";

    } else {

        labelElement.style.background = "#edf4ff";
        labelElement.style.color = "#246bfe";

    }

}


// ================= LISTENERS FOR SCORE =================

document.addEventListener("DOMContentLoaded", function () {


    const category =
        document.getElementById("issueCategory");

    const severityInputs =
        document.querySelectorAll(
            'input[name="severity"]'
        );


    if (category) {

        category.addEventListener(
            "change",
            calculatePriority
        );

    }


    severityInputs.forEach(function (input) {

        input.addEventListener(
            "change",
            calculatePriority
        );

    });


    updateDashboard();

    createChart();

});


// ================= SUBMIT REPORT =================

document.getElementById("reportForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const category =
            document.getElementById("issueCategory").value;

        const location =
            document.getElementById("issueLocation").value;

        const severity =
            document.querySelector(
                'input[name="severity"]:checked'
            ).value;

        const description =
            document.getElementById("issueDescription").value;


        const categoryNames = {

            pothole: "Pothole / Road Damage",
            garbage: "Garbage Overflow",
            streetlight: "Broken Streetlight",
            water: "Water Leakage",
            manhole: "Open Manhole"

        };


        const categoryName =
            categoryNames[category];


        // Calculate score again

        let score = 0;

        if (severity === "low") score = 30;
        if (severity === "medium") score = 50;
        if (severity === "high") score = 75;


        const categoryImpact = {

            pothole: 12,
            garbage: 8,
            streetlight: 5,
            water: 10,
            manhole: 15

        };


        score += categoryImpact[category] || 5;

        score = Math.min(score, 100);


        let priority = "LOW";

        if (score >= 80) {

            priority = "CRITICAL";

        } else if (score >= 65) {

            priority = "HIGH";

        } else if (score >= 45) {

            priority = "MEDIUM";

        }


        // Create new report

        const newReport = {

            id: Date.now(),

            category: categoryName,

            location: location,

            severity: severity,

            description: description,

            score: score,

            priority: priority,

            status: "Pending"

        };


        reports.push(newReport);

        saveReports();


        // Close report modal

        closeReportModal();


        // Show score

        document.getElementById("successScore")
            .textContent = score;


        document.getElementById("successModal")
            .classList.add("active");


        // Reset form

        document.getElementById("reportForm").reset();


        document.getElementById("calculatedScore")
            .textContent = "--";

        document.getElementById("priorityLabel")
            .textContent = "Complete the form";


        // Update dashboard

        updateDashboard();

        createChart();

    });


// ================= DASHBOARD UPDATE =================

function updateDashboard() {

    const total =
        reports.length;


    const critical =
        reports.filter(
            r => r.priority === "CRITICAL"
        ).length;


    const inProgress =
        reports.filter(
            r => r.status === "In Progress"
        ).length;


    const resolved =
        reports.filter(
            r => r.status === "Resolved"
        ).length;


    // Dashboard numbers

    document.getElementById("totalReports")
        .textContent = total + 123;


    document.getElementById("criticalIssues")
        .textContent = critical + 6;


    document.getElementById("progressIssues")
        .textContent = inProgress + 20;


    document.getElementById("resolvedIssues")
        .textContent = resolved + 60;


    // Hero numbers

    document.getElementById("heroReports")
        .textContent = total + 123;


    document.getElementById("heroResolved")
        .textContent = resolved + 63;


    renderIssues();

}


// ================= RENDER ISSUES =================

function renderIssues() {

    const list =
        document.getElementById("issueList");


    if (!list) return;


    // Sort by score

    const sortedReports =
        [...reports].sort(
            (a, b) => b.score - a.score
        );


    list.innerHTML = "";


    sortedReports
        .slice(0, 6)
        .forEach(function (report) {


            let icon = "🚧";

            let background = "red-bg";


            if (
                report.category
                    .toLowerCase()
                    .includes("garbage")
            ) {

                icon = "🗑️";
                background = "orange-bg";

            }


            if (
                report.category
                    .toLowerCase()
                    .includes("water")
            ) {

                icon = "🚰";
                background = "red-bg";

            }


            if (
                report.category
                    .toLowerCase()
                    .includes("street")
            ) {

                icon = "💡";
                background = "orange-bg";

            }


            if (
                report.category
                    .toLowerCase()
                    .includes("manhole")
            ) {

                icon = "⚠️";
                background = "red-bg";

            }


            const priorityClass =
                report.priority === "HIGH" ||
                report.priority === "CRITICAL"
                    ? "high"
                    : "medium";


            const item =
                document.createElement("div");


            item.className = "issue-item";


            item.innerHTML = `

                <div class="issue-type-icon ${background}">
                    ${icon}
                </div>

                <div class="issue-details">

                    <h4>${report.category}</h4>

                    <p>📍 ${report.location}</p>

                </div>

                <div class="issue-priority">

                    <strong>${report.score}</strong>

                    <span class="${priorityClass}">
                        ${report.priority}
                    </span>

                </div>

            `;


            list.appendChild(item);

        });

}


// ================= SHOW ALL ISSUES =================

function showAllIssues() {

    const list =
        document.getElementById("issueList");


    const sortedReports =
        [...reports].sort(
            (a, b) => b.score - a.score
        );


    list.innerHTML = "";


    sortedReports.forEach(function (report) {

        const item =
            document.createElement("div");


        item.className = "issue-item";


        item.innerHTML = `

            <div class="issue-type-icon red-bg">
                📋
            </div>

            <div class="issue-details">

                <h4>${report.category}</h4>

                <p>
                    📍 ${report.location}
                    · ${report.status}
                </p>

            </div>

            <div class="issue-priority">

                <strong>${report.score}</strong>

                <span class="${
                    report.priority === "HIGH" ||
                    report.priority === "CRITICAL"
                        ? "high"
                        : "medium"
                }">
                    ${report.priority}
                </span>

            </div>

        `;


        list.appendChild(item);

    });

}


// ================= CHART =================

function createChart() {

    const canvas =
        document.getElementById("issueChart");


    if (!canvas) return;


    // Destroy old chart

    if (window.civicChart) {

        window.civicChart.destroy();

    }


    window.civicChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels: [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ],

                datasets: [

                    {
                        label: "Reports",

                        data: [
                            12,
                            18,
                            15,
                            23,
                            19,
                            28,
                            24
                        ],

                        borderWidth: 2,

                        tension: 0.4,

                        fill: false
                    },

                    {
                        label: "Resolved",

                        data: [
                            7,
                            10,
                            12,
                            14,
                            16,
                            18,
                            21
                        ],

                        borderWidth: 2,

                        tension: 0.4,

                        fill: false
                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        labels: {

                            boxWidth: 8,

                            font: {
                                size: 9
                            }

                        }

                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {
                            font: {
                                size: 9
                            }
                        }

                    },

                    x: {

                        ticks: {
                            font: {
                                size: 9
                            }
                        }

                    }

                }

            }

        });

}


// ================= CLOSE MODALS =================

document.addEventListener("click", function (event) {

    const reportModal =
        document.getElementById("reportModal");

    const successModal =
        document.getElementById("successModal");


    if (
        event.target === reportModal
    ) {

        closeReportModal();

    }


    if (
        event.target === successModal
    ) {

        closeSuccessModal();

    }

});


// ================= KEYBOARD =================

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeReportModal();

        closeSuccessModal();

    }

});