// ==UserScript==
// @name         Partyflock event ICS
// @namespace    https://cytodev.io/
// @version      1.0.3
// @description  Convert a partyflock timetable to an ICS file
// @author       cytodev <mail@cytodev.io>
// @match        https://partyflock.nl/*
// @require      https://raw.githubusercontent.com/CytoDev/PartyflockEventICS/v1.0.3/src/PartyflockEventICS.js
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    let partyflockEventICS = new PartyflockEventICS();

    let button   = document.createElement("a");
    let elements = {
        partyHeader : document.getElementById("party-header"),
        partyInfo   : document.getElementsByClassName("party-info")[0],
        goingmenu   : document.getElementById("goingmenu"),
        lineup      : document.getElementById("lineup")
    };

    partyflockEventICS.setTitle(partyflockEventICS.parseHeader(elements.partyHeader));
    partyflockEventICS.setTime(elements.partyInfo.getElementsByTagName("time")[0].getAttribute("datetime"), elements.partyInfo.getElementsByTagName("time")[1].getAttribute("datetime"));
    partyflockEventICS.setLocation(partyflockEventICS.parseLocation(elements.partyInfo));
    partyflockEventICS.setDescription(partyflockEventICS.parseLineup(elements.lineup));

    button.innerHTML = "Download partyflock Event ICS";
    button.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(partyflockEventICS.getEventICS()));
    button.setAttribute("download", partyflockEventICS.getTitle() + ".ics");

    elements.goingmenu.appendChild(button);
})();
