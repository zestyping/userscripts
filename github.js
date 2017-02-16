// ==UserScript==
// @name         GitHub
// @namespace    http://tampermonkey.net/
// @version      0.2
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
  line-height: 14px;
  vertical-align: baseline;
}
.add-line-comment {
  height: 18px;
}
`;
    head.appendChild(style);
})();
