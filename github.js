// ==UserScript==
// @name         GitHub
// @namespace    http://tampermonkey.net/
// @version      0.3
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

/* Reduce height of repository search bar */
.header {
  padding: 6px 0;
}

/* Reduce spacing around page heading and repo heading */
.pagehead {
  padding-top: 12px;
}
.pagehead, .repohead {
  margin-bottom: 12px;
}

/* Reduce height of tabs */
a.reponav-item, .tabnav-tab {
  line-height: 16px;
}

/* Reduce line spacing in code */
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

/* Reduce vertical padding in file header */
.file-header {
  padding: 0 10px;
}
.btn-sm {
  line-height: 17px;
}

/* Reduce space between files */
.files-next-bucket .file {
  margin-bottom: 16px;
}

/* Reduce padding above diff summary bar */
.pr-toolbar {
  height: 50px;
}
.diffbar {
  padding-top: 10px;
}
`;
    head.appendChild(style);
})();
