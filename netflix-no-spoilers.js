// ==UserScript==
// @name         Netflix: No spoilers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide episode titles and descriptions
// @author       Ping
// @match        https://www.netflix.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
/* Episode descriptions in the episode carousel on the show's title page */
.episodeTitle, .episodeSynopsis {
  visibility: hidden;
}
/* Show title and show information overlays on the main watch page */
.video-title, .player-title-evidence, .evidence-overlay {
  visibility: hidden;
}
`;
    head.appendChild(style);
})();
