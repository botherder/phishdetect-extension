// Copyright (c) 2018-2021 Claudio Guarnieri.
//
// This file is part of PhishDetect.
//
// PhishDetect is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// PhishDetect is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with PhishDetect.  If not, see <https://www.gnu.org/licenses/>.

function sendReport(reportType, reportContent, identifier) {
    // Check if the report type is email_*.
    if (reportType == "email") {
        // If an email identifier was provided...
        if (identifier !== undefined && identifier !== null && identifier != "") {
            // Get a list of already shared emails.
            let emails = cfg.getReportedEmails();
            for (let i=0; i<emails.length; i++) {
                // If the email was already shared before, no need to
                // report it again.
                if (emails[i] == identifier) {
                    return;
                }
            }
        }
    }

    // Craft request to send to REST API server.
    const properties = {
        method: "POST",
        body: JSON.stringify({
            "type": reportType,
            "content": reportContent,
            "user_contact": cfg.getUserContact(),
            "key": cfg.getApiKey(),
        }),
        headers: {"Content-Type": "application/json"},
    };

    fetch(cfg.getAPIReportsAddURL(), properties)
        .then((response) => response.json())
        .then(function(data) {
            // We do this to avoid re-sharing already shared emails.
            if (reportType == "email") {
                if (identifier !== undefined && identifier != "") {
                    cfg.addReportedEmail(identifier);
                }
            }

            console.log("Submitted report of type", reportType, "to PhishDetect Node.");

            let confirmationPage = chrome.extension.getURL(REPORT_PAGE) + "?type=" + reportType;
            if (reportType == "url")
                confirmationPage += "&content="+ reportContent;

            chrome.tabs.create({url: confirmationPage});
        })
        .catch(error => {
            console.log("Failed to submit report: ", error);
            chrome.tabs.create({url: chrome.extension.getURL(REPORT_FAILED_PAGE)});
        });
}
