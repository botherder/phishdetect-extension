// Copyright (c) 2018-2020 Claudio Guarnieri.
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

import React from "react";
import ReactDOM from "react-dom";
import { HistoryAlert } from "../../components/History.js";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.method) {
    case "historyMatchFound":
        var url = request.match.url;
        var dateTime = new Date(request.match.visitTime).toString();
        var alerts = $("#alerts").empty();
        ReactDOM.render(React.createElement(HistoryAlert, {dateTime, url}), alerts.get(0));
        break;
    case "historyScanCompleted":
        $("#alerts").show();
        $("#statusInProgress").hide();
        $("#statusCompleted").show();
        break;
    }
});

document.addEventListener("DOMContentLoaded", function() {
    $("#startButton").click(function() {
        $("#startButton").hide();
        $("#statusInProgress").show();
        getTab(function(tab) {
            chrome.runtime.sendMessage({method: "scanHistory", tabId: tab.id});
        });
    });
});
