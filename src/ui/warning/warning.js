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

function loadContent() {
    const href = new URL(location.href);
    const url = href.searchParams.get("url");
    const cleanURL = $("<span>").text(url).html();
    $("#badURL").html(cleanURL);

    const indicator = href.searchParams.get("indicator");

    $("#reviewMistake").click(function() {
        chrome.runtime.sendMessage({method: "sendReview", ioc: indicator});
    })

    $("#takeMeAway").click(function() {
        window.location = "about:blank";
    });
}

document.addEventListener("DOMContentLoaded", cfg.loadFromBackground(loadContent));
