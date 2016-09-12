// ==UserScript==
// @name         Quip
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Fix formatting and hide the conversation sidebar on Quip pages
// @author       Ping
// @match        https://*.quip.com/*
// @grant        none
// ==/UserScript==

// Goal: Focus on the content.  Here's what this userscript does to Quip:
//   - Makes all formatting simple and uniform (Roboto on all pages)
//   - Makes headings easier to see (dark red)
//   - Hides the gigantic conversation sidebar when you first load any page
//   - Prevents the backtick key from horribly cycling through 9 formats
//   - Stops Quip from auto-bolding list items that have subitems
//   - Reduces the enormous wasteful margins around the page
//   - Shrinks the huge annoying bubble with the formatting buttons
//   - Shrinks the huge yellow chat button to a reasonable size

(function() {
    'use strict';

    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
body,
body div#app article div.content,
body div#app article .section[data-section-type="1"] ul li,
body div#app article .section[data-section-type="1"] ul li:before,
body .document-thread div,
body .document-thread div li {
    font-family: Roboto, Arial, "Quip Glyphs";
    font-weight: 400;
    font-size: 13px;
    line-height: 1.45;
}

body .document-thread div.header div {
    font-size: 11px;
}

body div#app article .content br {
    padding-top: 0.2em;
    display: block;
}

body div#app article .section[data-section-style="6"] ul li:before {
    font-size: inherit;
}

body div#app .document article {
    padding: 40px 30px;
}

/* HL: Main page heading */
body div#app article .section[data-section-style="1"]>.content,
body .document-thread div h1 {
    font-size: 28px;
    font-weight: 400;
}

/* HM: Section heading */
body div#app article .section[data-section-style="2"],
body .document-thread div h2 {
    margin: 24px 0 18px;
}

body div#app article .section[data-section-style="2"]>.content,
body .document-thread div h2 {
    font-size: 20px;
    font-weight: normal;
    color: #800;
    border-bottom: 1px solid #ccc;
}

/* HS: Subsection heading */
body div#app article .section[data-section-style="3"],
body .document-thread div h3 {
    margin: 24px 0 12px;
}

body div#app article .section[data-section-style="3"]>.content,
body .document-thread div h3 {
    color: #800;
    font-size: 15px;
    font-weight: bold;
    text-transform: none;
}

/* Code block */
body div#app article .section[data-section-style="4"]>.content,
body div#app article .section[data-section-style="0"]>.content code,
body .document-thread div pre {
    font-family: Lucida Sans Typewriter, Monaco, Menlo, Courier, monospace, 'Quip Glyphs';
    font-size: 12px;
    text-shadow: none;
}

body div#app article .section[data-section-style="4"]>.content {
    padding: 3px 3px 3px 24px;
}

body div#app article .section[data-section-style="0"]>.content code {
    display: inline-block;
    padding: 1px 2px;
    margin: 0 1px;
    border-radius: 2px;
}

/* Bulleted list section */
body div#app article .section[data-section-style="5"] {
    margin: 12px 0 6px;
}

/* Numbered list section */
body div#app article .section[data-section-style="6"] {
    margin: 12px 0 6px;
}

/* Normal text */
body div#app article .section[data-section-style="0"]>.content {
    font-size: 13px;
}

/* Block quote */
body div#app article .section[data-section-style="16"] {
    margin-top: -0.3em;
    margin-bottom: 0;
}

body div#app article .section[data-section-style="16"]>.content {
    padding-left: 8em;
    color: #888;
    font-size: 12px;
    font-weight: 300;
    font-style: italic;
}

body div#app article .section[data-section-style="16"]>.content:before {
    background: none;
}

body div#app article .section[data-section-style="16"]>.content u {
    text-transform: uppercase;
    color: #0a4;
    font-size: 12px;
    font-style: normal;
    font-weight: normal;
    text-decoration: none;
    margin-left: -2em;
    padding-right: 0.7em;
}

div#toc-div ul li a, div ul.listtype-comment li span {
    font-weight: 300;
    line-height: 1.4em;
}

span#sharesummary {
    background: none !important;
}

div.toc-entry span b {
    font-weight: normal;
}

div.toc-entry {
    margin-bottom: 0.5em;
}

#padeditor #add-to-collection {
    background: none;
    border: none;
}

span.user-caret {
    left: 0px !important;
}

span.user-caret-offscreen-top, span.user-caret-offscreen-bottom {
    left: 64px !important;
}

span.user-caret img {
    display: none;
}

span.user-caret-initials {
    padding: 3px;
}

div.editor-stylebar {
    opacity: 0.5;
    left: -29px;
    top: 0px;
    width: 16px;
    height: 16px;
}

div.editor-stylebar div.editor-stylebar-style {
    width: 16px;
    height: 16px;
    background-size: 12px 12px;
}

div.editor-stylebar div.editor-stylebar-selection-background {
    width: 14px;
    height: 14px;
    top: 1px;
    left: 1px;
}

div.editor-stylebar.visible.expanded {
    left: 14px;
}

.editor-stylebar .editor-stylebar-bubble,
.editor-stylebar.expanded.cover-text .editor-stylebar-bubble {
    width: 54px;
    height: 64px;
    transform: translate3d(-42px, -24px, 0);
}

.editor-stylebar.expanded.cover-text .editor-stylebar-style[data-style="0"],
.editor-stylebar.expanded.cover-text[data-section-style="0"] .editor-stylebar-selection-background {
    transform: translate3d(-39px, -21px, 0);
}

.editor-stylebar.expanded.cover-text .editor-stylebar-style[data-style="1"],
.editor-stylebar.expanded.cover-text[data-section-style="1"] .editor-stylebar-selection-background {
    transform: translate3d(-39px, 0, 0);
}

.editor-stylebar.expanded.cover-text .editor-stylebar-style[data-style="2"],
.editor-stylebar.expanded.cover-text[data-section-style="2"] .editor-stylebar-selection-background {
    transform: translate3d(-23px, 0, 0);
}

.editor-stylebar.expanded.cover-text .editor-stylebar-style[data-style="3"],
.editor-stylebar.expanded.cover-text[data-section-style="3"] .editor-stylebar-selection-background {
    transform: translate3d(-7px, 0, 0);
}

.editor-stylebar.expanded.cover-text .editor-stylebar-style[data-style="4"],
.editor-stylebar.expanded.cover-text[data-section-style="4"] .editor-stylebar-selection-background {
    transform: translate3d(-7px, -21px, 0);
}

.editor-stylebar.expanded.cover-text .editor-stylebar-style[data-style="5"],
.editor-stylebar.expanded.cover-text[data-section-style="5"] .editor-stylebar-selection-background {
    transform: translate3d(-39px, 21px, 0);
}

.editor-stylebar.expanded.cover-text .editor-stylebar-style[data-style="6"],
.editor-stylebar.expanded.cover-text[data-section-style="6"] .editor-stylebar-selection-background {
    transform: translate3d(-7px, 21px, 0);
}

.editor-stylebar.expanded.cover-text .editor-stylebar-style[data-style="7"],
.editor-stylebar.expanded.cover-text[data-section-style="7"] .editor-stylebar-selection-background {
    transform: translate3d(-23px, 21px, 0);
}

.editor-stylebar.expanded.cover-text .editor-stylebar-style[data-style="16"],
.editor-stylebar.expanded.cover-text[data-section-style="16"] .editor-stylebar-selection-background {
    transform: translate3d(-23px, -21px, 0);
}

.annotation-gutter-icon {
    left: 12px;
    margin-top: -1px;
    width: 20px;
    height: 20px;
    background-size: 20px 20px;
}

.annotation-gutter-icon.numbered {
    font-size: 10px;
    line-height: 19px;
}

/* Chat bubbles */
.message-bubble .chat-bubble, .message-bubble .chat-card {
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
}

.chat-bubble .chat-bubble-bg {
    border-radius: 6px;
}

.chat-bubble .chat-bubble-body {
    padding: 6px;
}

.app .document-thread .outline-inline-container {
    padding-right: 0;
}

.app .document-thread .outline-inline-container>.editor-outline {
    border-radius: 0;
    border-right: none;
    margin: 60px 0 0 0;
    padding: 4px 0;
    width: 300px;
}

.editor-outline .editor-outline-section {
    margin: 4px 8px;
}

.app .document-thread .outline-inline-container>.editor-outline .editor-outline-title {
    display: none;
}
`;
    head.appendChild(style);

    // Disable the annoying backtick key.
    document.body.addEventListener('keydown', function(event) {
        if (event.keyCode === 192) {
            console.log('blocked keydown event for backtick');
            event.stopPropagation();
            event.preventDefault();
            return false;
        }
    }, true);

    // Hide the conversation sidebar.
    function hide_conversation() {
        var button = document.querySelector('.icon-hide-conversation');
        if (button) {
            button.click();
        } else {
            window.setTimeout(hide_conversation, 100);
        }
    }
    hide_conversation();
})();
