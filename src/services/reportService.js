const REPORTS_KEY = 'spa_reports'

function readJSON(key) {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : []
    } catch (err) {
        return []
    }
}

function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)) } catch (e) { }
}

export function getReports() {
    return readJSON(REPORTS_KEY)
}

export function createReport(reportData) {
    const reports = getReports()
    const newReport = {
        id: Date.now().toString(),
        ...reportData,
        status: 'pending', // pending, resolved, dismissed
        createdAt: new Date().toISOString()
    }
    reports.push(newReport)
    writeJSON(REPORTS_KEY, reports)
    return newReport
}

export function updateReportStatus(id, status) {
    const reports = getReports()
    const idx = reports.findIndex(r => r.id === id)
    if (idx !== -1) {
        reports[idx].status = status
        writeJSON(REPORTS_KEY, reports)
        return true
    }
    return false
}

export function deleteReport(id) {
    const reports = getReports()
    const updated = reports.filter(r => r.id !== id)
    writeJSON(REPORTS_KEY, updated)
    return true
}
