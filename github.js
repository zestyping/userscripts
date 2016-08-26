// ==UserScript==
// @name         GitHub
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix formatting
// @author       Ping
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
.blob-num, .blob-code-inner {
  font-size: 11px;
}
.blob-num, .blob-code {
  line-height: 16px;
  vertical-align: baseline;
}
`;
    head.appendChild(style);
})();
