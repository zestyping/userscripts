// ==UserScript==
// @name         Quip
// @namespace    http://tampermonkey.net/
// @version      1.4
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
body div#app .navigation-controller .nav-path input.nav-path-title,
body div#app .document-thread div,
body div#app .document-thread div li,
body div#app .jetson-chat-thread .jetson-message-document-body div,
body div#app .jetson-chat-thread .jetson-message-document-body div li,
body div#app .jetson-chat-thread .jetson-message-document-body div p,
body div#app .search-input input,
.jetson-chat-thread-input .text-box,
.jetson-button-text {
    font-family: Roboto, Arial, "Quip Glyphs";
    font-weight: 400;
    font-size: 13px;
    line-height: 1.45;
}

/* === toolbar area === */

/* folder path */
#app .navigation-controller .nav-path input.nav-path-title {
    text-align: left;
}
#app .navigation-controller-path {
    justify-content: flex-start;
    padding: 0 18px;
    height: 18px !important;
}

/* "External" warning */
#app .navigation-controller-path .jetson-button {
    height: 16px !important;
    padding: 0 4px !important;
}

/* toolbar buttons */
.jetson-button, #app .nav-global-search {
    height: 22px !important;
    padding: 0 4px !important;
}
.jetson-button-icon {
    height: 16px !important;
}
.jetson-button-text {
    font-size: 13px !important;
}

/* toolbar button area */
#app .navigation-controller-toolbar .navigation-controller-path + div {
    opacity: 0.3;
}
#app .navigation-controller-toolbar:hover .navigation-controller-path + div {
    opacity: 1;
}
#app .navigation-controller-toolbar {
    height: 40px !important;
}

/* horizontal rule along the bottom of the toolbar */
.navigation-controller-toolbar:not(.has-notification-bar):after {
    background: transparent;
}

/* document area, below the toolbar */
#app .navigation-controller-body {
    top: 40px !important;
}

.parts-toolbar {
    padding: 0 18px !important;
}

#app .navigation-controller-path + div {
    top: 16px !important;
}

/* === conversation/history area === */
body .jetson-document-chat .parts-screen-body {
    box-shadow: inset 0 1px 2px 0px rgba(0,0,0,0.2);
}

body .jetson-message-document-body div ul {
    padding-left: 12px;
}

body .document-thread div.header div {
    font-size: 11px;
}

/* profile icons */
.jetson-message-picture {
    width: 22px;
    margin-right: 4px;
}
.jetson-message-picture > div > div {
    border-radius: 11px !important;
}
.jetson-message-picture > div,
.jetson-message-picture img {
    width: 22px !important;
    height: 22px !important;
}

/* history snippets */
.jetson-message-quote {
    margin-top: 0;
    padding-left: 8px;
    padding-top: 0;
    padding-bottom: 0;
}
.jetson-message-quote-links {
    margin-top: 6px;
}
.jetson-message-button {
    padding-top: 2px;
    width: 12px;
    height: 12px;
}

/* chat box */
.jetson-chat-thread-input .text-box {
    font-size: 13px;
    line-height: 1.45;
    padding: 2px 6px;
}

.message-input-jetson-attach, .message-input-jetson-emoji {
    width: 12px;
    height: 12px;
    margin-right: 2px;
    margin-top: 4px;
}

.parts-screen-footer {
    height: 32px !important;
}

/* === overall margins === */

.parts-screen-body, .parts-screen-children-wrapper {
    padding: 0 !important;
}
body div#app .document article.article {
    padding: 0 18px;
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


/* links */
.document a, .link, lnk, .document .article control a.content {
    color: #08c;
}

/* HL: Main page heading */
body div#app article .section[data-section-style="1"],
body .document-thread div h1 {
    margin: 0 0 16px;
}

body div#app article .section[data-section-style="1"]>.content,
body .document-thread div h1 {
    font-size: 28px;
    font-weight: 400;
}

/* HM: Section heading */
body div#app article .section[data-section-style="2"],
body .document-thread div h2 {
    margin: 20px 0 16px;
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
div.document code, div.document pre, div.thread-thumbnail-document code,
body div#app article .section[data-section-style="4"]>.content,
body div#app article .section[data-section-style="0"]>.content code,
body .document-thread div pre {
    font-family: "Lucida Sans Typewriter", Monaco, Menlo, Courier, monospace, "Quip Glyphs";
    font-size: 12px;
    text-shadow: none;
    color: #070;
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
    left: -48px;
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
    left: 0;
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
}

.editor-outline .editor-outline-section {
    margin: 4px 8px;
}

.editor-outline .editor-outline-section[data-section-style="2"],
.editor-outline .editor-outline-section[data-section-style="3"] {
    font-weight: normal;
    color: #800 !important;
    text-transform: none;
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
        var button = document.querySelector('.icon-hide-conversation') ||
            document.querySelector('.jetson-document-chat-hide');
        if (button) {
            button.click();
        } else {
            window.setTimeout(hide_conversation, 100);
        }
    }
    hide_conversation();
})();
