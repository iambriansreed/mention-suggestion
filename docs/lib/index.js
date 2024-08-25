export default function createMention(prefix, contentEditableElement) {
    const prefixRegex = new RegExp(`^${prefix}[a-zA-Z0-9]*|\\s${prefix}[a-zA-Z0-9]*`, 'g');
    let errors = [];
    if (!prefix) {
        errors.push('No prefix provided');
    }
    if (!contentEditableElement) {
        errors.push('No contenteditable element provided');
    }
    if (!contentEditableElement.isContentEditable) {
        errors.push('contentEditableElement must be a contenteditable element');
    }
    if (errors.length) {
        throw new Error(`MentionComponent: ${errors.join(', ')}`);
    }
    let lastPosition = null;
    let lastMatchIndex = null;
    let validInstance;
    let lastSelection = null;
    let isMentioning = false;
    let onEvent = {
        update: (_) => { },
        start: (_) => { },
        stop: () => { },
    };
    function on(eventName, callback) {
        onEvent[eventName] = callback;
    }
    const stop = () => {
        if (!isMentioning)
            return;
        isMentioning = false;
        lastPosition = null;
        lastMatchIndex = null;
        validInstance = null;
        lastSelection = null;
        onEvent.stop();
    };
    const checkForMention = () => {
        var _a, _b;
        const selection = document.getSelection();
        const textValue = ((_a = selection.anchorNode) === null || _a === void 0 ? void 0 : _a.nodeValue) || '';
        const matchingTextSegments = textValue.matchAll(prefixRegex);
        validInstance = [...matchingTextSegments].find((instanceMatch) => {
            const instance = instanceMatch[0];
            return (selection.anchorOffset >= instanceMatch.index &&
                selection.anchorOffset <= instanceMatch.index + instance.length);
        });
        if (!validInstance) {
            stop();
            return;
        }
        if (validInstance.index !== lastMatchIndex) {
            lastPosition = null;
        }
        const position = (lastPosition = lastPosition || selection.getRangeAt(0).getBoundingClientRect());
        const query = (_b = validInstance === null || validInstance === void 0 ? void 0 : validInstance[0]) === null || _b === void 0 ? void 0 : _b.trim().slice(prefix.length);
        if (isMentioning) {
            onEvent.update({
                position,
                query,
            });
        }
        isMentioning = true;
        onEvent.start({
            position,
            query,
        });
    };
    let checkTimeout = 0;
    const checkForMentionDebounced = () => {
        clearTimeout(checkTimeout);
        checkTimeout = setTimeout(checkForMention, 10);
    };
    const selectionChangeCallback = () => {
        var _a;
        const selection = document.getSelection();
        const anchorElement = (_a = selection.anchorNode) === null || _a === void 0 ? void 0 : _a.parentElement;
        if (!anchorElement)
            return;
        if (contentEditableElement.contains(anchorElement)) {
            lastSelection = selection;
            checkForMentionDebounced();
            return;
        }
        setTimeout(stop, 1);
    };
    const set = (mentionElement) => {
        let range;
        if (!mentionElement ||
            !validInstance ||
            typeof validInstance.index === 'undefined' ||
            !lastSelection) {
            return;
        }
        range = document.createRange();
        range.setStart(lastSelection.anchorNode, validInstance.index + validInstance[0].indexOf(prefix));
        range.setEnd(lastSelection.anchorNode, validInstance.index + validInstance[0].length);
        range.deleteContents();
        const newElement = mentionElement.cloneNode(true);
        newElement.setAttribute('contenteditable', 'false');
        range.insertNode(newElement);
        newElement.after(' ');
        range = document.createRange();
        range.setStart(newElement.nextSibling, 1);
        range.collapse(true);
        lastSelection.removeAllRanges();
        lastSelection.addRange(range);
        stop();
    };
    document.addEventListener('selectionchange', selectionChangeCallback);
    contentEditableElement.addEventListener('input', checkForMentionDebounced);
    return {
        set,
        stop: stop,
        off: () => {
            document.removeEventListener('selectionchange', selectionChangeCallback);
            contentEditableElement.removeEventListener('input', checkForMentionDebounced);
        },
        on,
    };
}
//# sourceMappingURL=index.js.map