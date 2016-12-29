// ==UserScript==
// @name         c3subtitles
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  autocompletion for c3subtitles!
// @author       http://github.com/zestyping
// @match        https://live.c3subtitles.de/write/*
// @grant        none
// ==/UserScript==

(function() {
    var timesTyped = {};
    var completions = {};
    var isCompleted = {};

    window.setTimeout(function() {
        document.body.style.lineHeight = '1.5';
        var pendingArea = document.querySelector('div[style="display: flex; flex-direction: column-reverse;"]');
        pendingArea.style.padding = '2em 0 0 0';
        pendingArea.style.opacity = '0.6';
        pendingArea.style.fontStyle = 'italic';

        var field = document.querySelector('input');
        field.style.fontFamily = 'Roboto';
        field.style.fontSize = '16px';

        var parent = field.parentElement;
        parent.style.position = 'relative';

        var hint = document.createElement('span');
        hint.style.fontSize = '16px';
        hint.style.position = 'absolute';
        hint.style.left = field.offsetLeft + 'px';
        hint.style.bottom = '0px';
        hint.style.height = field.offsetHeight + 'px';
        hint.style.right = '0px';
        hint.style.color = '#2c2';
        hint.style.pointerEvents = 'none';
        hint.style.textAlign = 'right';
        hint.innerText = 'use TAB to autocomplete\xa0\xa0';
        parent.appendChild(hint);

        var measure = document.createElement('span');
        measure.style.position = 'absolute';
        measure.style.opacity = '0';
        measure.style.fontSize = '16px';
        parent.appendChild(measure);

        function measureWidth(text) {
            measure.innerText = text;
            return measure.offsetWidth;
        }

        var inputEvent = new Event('input', { bubbles: true });
        var lastWord = '';
        var keysHeld = 0;

        var handleKeyDown = function(keyEvent) {
            keysHeld += 1;
            if (keyEvent.keyCode === 9) {
                keyEvent.preventDefault();  // don't move focus
            }
        };
        var handleKeyUp = function(keyEvent) {
            keysHeld -= 1;
            var keyCode = keyEvent.keyCode;
            if ((keyCode === 32 || keyCode === 13) &&  // finished word
                keysHeld === 0) {  // not still holding down last letter
                var word = lastWord.replace(/[^a-zA-Z0-9\xc0-\xff]*$/, '');  // ignore trailing punctuation
                timesTyped[word] = (timesTyped[word] || 0) + 1;
                if (timesTyped[word] >= 2) {
                    for (var i = word.length - 1; i >= 2; i--) {
                        var prefix = word.substring(0, i);
                        var rest = word.substring(i);
                        completions[prefix] = rest;
                        if (isCompleted[prefix]) break;
                    }
                    isCompleted[word] = true;
                }
            }

            lastWord = field.value.replace(/.* /, '');
            completion = completions[lastWord];
            if (keyCode === 9 && completion) {  // tab
                field.value += completion;
                field.dispatchEvent(inputEvent);  // make React notice the new text
                lastWord = field.value.replace(/.* /, '');  // maybe complete a longer word
                completion = completions[lastWord];
            }
            hint.innerText = completion || '';
            if (completion) {
                hint.style.left = (4 + measureWidth(field.value)) + 'px';
                hint.style.textAlign = 'left';
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }, 3000);
})();
