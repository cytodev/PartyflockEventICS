/**
 * PartyflockEventICS.js
 *
 * This script is meant to be used in combination with a userscript in order to
 * correctly function. If you don't have a userscriptt plug-in installed now
 * would be a good time to look for one you like.
 *
 * Usage:
 *   Link to this file (either from the master branche, or a version tag) inside
 *   your userscript in order to use the functionality provided. To start
 *   parsing the event page you will first need to pass the "#party-header"
 *   element to the `parseHeader` function in order to get the event's title.
 *   After getting the title, the next logical step would be to get the start
 *   and end times of the event. The location can be found in ".party-info", and
 *   the line-up/timetable can be found in "#lineup".
 *
 *   For a general idea of how I did this myself, please see `sample.user.js`.
 *
 * @author Roel Walraven <mail@cytodev.io>
 *
 * This file is licensed under The MIT License (MIT)
 *
 *   Copyright (c) 2017 Roel Walraven <mail@cytodev.io>
 *
 *   Permission  is hereby  granted, free  of  charge, to any person obtaining a
 *   copy of this software and associated documentation files  (the "Software"),
 *   to  deal in the Software without  restriction, including without limitation
 *   the  rights to use,  copy, modify,  merge, publish, distribute, sublicense,
 *   and/or  sell copies  of  the Software, and  to  permit  persons to whom the
 *   Software is furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included  in
 *   all copies or substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY  KIND, EXPRESS OR
 *   IMPLIED,  INCLUDING BUT  NOT LIMITED TO THE  WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS  OR COPYRIGHT  HOLDERS BE  LIABLE FOR ANY  CLAIM, DAMAGES OR  OTHER
 *   LIABILITY, WHETHER  IN AN  ACTION OF  CONTRACT, TORT OR OTHERWISE,  ARISING
 *   FROM, OUT  OF  OR IN CONNECTION  WITH  THE  SOFTWARE  OR THE  USE  OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 */

"use strict";

function PartyflockEventICS() {

    /**
     * countryFlags
     *   UTF-8 Flags based on the indexing that partyflock.nl uses. Seeing how
     *   partyflock.nl starts with 1.png, the first item in this array is a
     *   blank (white) flag.
     *
     * @todo: complete the list of flags.
     *
     * @type {Array}
     */
    this.countryFlags = [
        "🏳","🇳🇱","🇩🇪","🇬🇧","🇮🇱","🇮🇹","🇧🇪","🇬🇷","🇺🇸","🇨🇭","🇪🇸","🇦🇺","🇸🇪","🇫🇷","🇯🇵","🇵🇱",
        "🇸🇮","🇮🇪","🇵🇹","🇦🇹","🇸🇰","�","🇸🇬","🇧🇷","🇷🇸","🇲🇨","🇱🇺","🇳🇴","🇫🇮","🇩🇰","🇨🇦","🇮🇸",
        "🇷🇺","🇭🇺","�","🇨🇿","�","�","🇧🇦","🇷🇴","🇲🇹","🇨🇱","🇦🇪","🇯🇲","🇳🇿","🇹🇷","�","🇦🇷",
        "🏴󠁧󠁢󠁳󠁣󠁴󠁿","🇮🇩","🇨🇳","🇹🇭","🇨🇺","🇪🇬","🇧🇬","🇰🇪","🇦🇫","🇮🇶","🇲🇽","�","�","�","�","�",
        "�","�","�","�","�","�","�","�","�","�","�","�","�","�","�","🇺🇦",
    ];

    /**
     * event
     *
     * @type {Object}
     */
    this.event = {
        title       : null,
        timeStart   : null,
        timeEnd     : null,
        location    : null,
        description : null
    };

    /**
     * setTitle
     *
     * @param {String} title [value to update with]
     */
    this.setTitle = function(title) {
        this.event.title = title;
    };

    /**
     * getTitle
     *
     * @return {String} title [Current value of update]
     */
    this.getTitle = function() {
        return this.event.title;
    };

    /**
     * setTimeStart
     *
     * @param {String} timeStart [value to update with]
     */
    this.setTimeStart = function(timeStart) {
        this.event.timeStart = timeStart.replace(/[-:]/g, "").split("+")[0];
    };

    /**
     * getTimeStart
     *
     * @return {String} timeStart [Current value of update]
     */
    this.getTimeStart = function() {
        return this.event.timeStart;
    };

    /**
     * setTimeEnd
     *
     * @param {String} timeEnd [value to update with]
     */
    this.setTimeEnd = function(timeEnd) {
        this.event.timeEnd = timeEnd.replace(/[-:]/g, "").split("+")[0];
    };

    /**
     * getTimeEnd
     *
     * @return {String} timeEnd [Current value of update]
     */
    this.getTimeEnd = function() {
        return this.event.timeEnd;
    };

    /**
     * setTime
     *
     * @param {String} timeStart [Start time]
     * @param {String} timeEnd   [End time]
     */
    this.setTime = function(timeStart, timeEnd) {
        this.setTimeStart(timeStart);
        this.setTimeEnd(timeEnd);
    };

    /**
     * setLocation
     *
     * @param {String} location [value to update with]
     */
    this.setLocation = function(location) {
        this.event.location = location;
    };

    /**
     * getLocation
     *
     * @return {String} location [Current value of update]
     */
    this.getLocation = function() {
        return this.event.location;
    };

    /**
     * setDescription
     *
     * @param {String} description [value to update with]
     */
    this.setDescription = function(description) {
        this.event.description = description;
    };

    /**
     * getDescription
     *
     * @return {String} description [Current value of update]
     */
    this.getDescription = function() {
        return this.event.description;
    };

    /**
     * getEventICS
     *   Builds and returns the event as iCalendar markup.
     *
     * @return {String} [Event object in iCalendar markup]
     */
    this.getEventICS = function() {
        return "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//partyflock//Website//NL\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nBEGIN:VEVENT\nSUMMARY:" + this.getTitle() + "\nDTSTART:" + this.getTimeStart() + "\nDTEND:" + this.getTimeEnd() + "\nLOCATION:" + this.getLocation() + "\nDESCRIPTION:" + this.getDescription() + "\nEND:VEVENT\nEND:VCALENDAR\n";
    };

}

/**
 * parseHeader
 *   Parses the header from the page and returns the event's title.
 *
 * @param  {HTMLElement} headerElement [Element to extract from]
 * @return {String}                    [Parsed result]
 */
PartyflockEventICS.prototype.parseHeader = function(headerElement) {
    let title    = headerElement.getElementsByTagName("h1")[0].textContent;
    let subtitle = headerElement.getElementsByClassName("subtitle");

    if(subtitle.length > 0) {
        for(let index = 0; index < subtitle.length; index++)
            title += " · " + subtitle[index].textContent;
    }

    return title;
};

/**
 * parseLocation
 *   Parses the Google maps URL from the page and returns the coordinates.
 *
 * @param  {HTMLElement} infoElement [Element to extract from]
 * @return {String}                  [Parsed result]
 */
PartyflockEventICS.prototype.parseLocation = function(infoElement) {
    let spans = infoElement.getElementsByTagName("span");

    for(let span in spans) {
        if(!(spans[span] instanceof HTMLElement))
            continue;

        if(spans[span].getAttribute("itemprop") === "location") {
            let links = spans[span].getElementsByTagName("a");

            for(let link in links) {
                if(!(links[link] instanceof HTMLElement))
                    continue;

                if(links[link].getAttribute("href").indexOf("maps/place") < 0)
                    continue;

                let coordinates = links[link].getAttribute("href").split("@")[1].split("?")[0].split(",");

                return links[0].textContent + " @ " + coordinates[0] + "," + coordinates[1];
            }

            window.console.warn("No location found");
        }
    }
};

/**
 * parseLineup
 *   Parses the lineup information and returns a UTF-8 formatted string,
 *
 * @param  {HTMLElement} lineupElement [Element to extract from]
 * @return {String}                    [Parsed result]
 */
PartyflockEventICS.prototype.parseLineup = function(lineupElement) {
    let rows   = lineupElement.getElementsByTagName("tr");
    let parsed = "";

    for(let index = 0; index < rows.length; index++) {
        let item = rows[index];

        if(item.children[0].nodeName === "TH") {
            if(index > 0)
                parsed += "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\\n";

            parsed += item.children[0].children[1].textContent + "\\n";
        } else {
            for(let subindex = 0; subindex < item.children[0].children.length; subindex++) {
                let performer = {
                    favourite : "",
                    time      : "",
                    name      : "",
                    country   : "",
                    genre     : ""
                };

                for(let dataItem = 0; dataItem < item.children[0].children[subindex].children.length; dataItem++) {
                    let data = item.children[0].children[subindex].children[dataItem];

                    if(data.classList.contains("invisible"))
                        continue;

                    performer.favourite = data.classList.contains("star") ? " ❤ " : " 　 ";

                    if(/^[0-9]{2}:[0-9]{2}\s-\s[0-9]{2}:[0-9]{2}:\s$/.test(data.textContent))
                        performer.time = data.textContent.trim();

                    if(data.getAttribute("itemprop") !== undefined && data.getAttribute("itemprop") === "performer")
                        performer.name = data.textContent.trim();

                    if(data.classList.contains("cflg"))
                        performer.country = data.textContent.trim();

                    if(data.classList.contains("master-genre"))
                        performer.genre += data.textContent.trim();
                }

                parsed += (performer.favourite
                        + (performer.time.length > 0 ? performer.time + " " : "")
                        + (item.children[0].children[subindex].textContent.indexOf("MC") > -1 ? "MC: " : "")
                        + performer.name
                        + (item.children[0].children[subindex].textContent.indexOf("Live") > -1 ? " · live" : "")
                        + performer.country
                        + (performer.genre.length > 0 ? " (" + performer.genre + ")" : "")).replace(/\s{2,}/g, " ") + "\\n";
            }
        }
    }

    return parsed;
};

/* jshint node : true  */

if(typeof module !== "undefined" && module.exports)
    module.exports = PartyflockEventICS;

/* jshint node : false  */
