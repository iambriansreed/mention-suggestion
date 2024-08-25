export type EventProps = {
    position: DOMRect;
    query: string;
};

export type OnEvent = {
    start: (prop: EventProps) => void;
    update: (prop: EventProps) => void;
    stop: () => void;
};

export type Mention = {
    set: (mentionElement: HTMLElement) => void;
    stop: () => void;
    off: () => void;
    on: <K extends keyof OnEvent>(eventName: K, callback: OnEvent[K]) => void;
};

/**
 * Creates a mention controller
 * @param {string} prefix - The prefix that will trigger the mention
 * @param {HTMLElement} contentEditableElement - The contenteditable element that the mention will be applied to
 * @returns {Mention}
 */
export default function createMention(prefix: string, contentEditableElement: HTMLElement): Mention {
    // regex to match the prefix
    const prefixRegex = new RegExp(`^${prefix}[a-zA-Z0-9]*|\\s${prefix}[a-zA-Z0-9]*`, 'g');

    let errors: string[] = [];

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

    let lastPosition: DOMRect | null = null;
    let lastMatchIndex: number | null = null;
    let validInstance: RegExpMatchArray | undefined | null;
    let lastSelection: Selection | null = null;
    let isMentioning = false;

    let onEvent: OnEvent = {
        update: (_: { position: DOMRect; query: string }) => {},
        start: (_: { position: DOMRect; query: string }) => {},
        stop: () => {},
    };

    function on<K extends keyof OnEvent>(eventName: K, callback: OnEvent[K]): void {
        onEvent[eventName] = callback;
    }

    const stop = () => {
        if (!isMentioning) return;

        isMentioning = false;
        lastPosition = null;
        lastMatchIndex = null;
        validInstance = null;
        lastSelection = null;
        onEvent.stop();
    };

    const checkForMention = () => {
        const selection = document.getSelection()!;

        const textValue = selection.anchorNode?.nodeValue || '';

        // find the mention instance that the cursor is currently in
        const matchingTextSegments = textValue.matchAll(prefixRegex);
        validInstance = [...matchingTextSegments].find((instanceMatch) => {
            const instance = instanceMatch[0];

            return (
                selection.anchorOffset >= instanceMatch.index &&
                selection.anchorOffset <= instanceMatch.index + instance.length
            );
        });

        // if no mention instance is found, stop mentioning
        if (!validInstance) {
            stop();
            return;
        }

        if (validInstance.index !== lastMatchIndex) {
            lastPosition = null;
        }

        const position = (lastPosition = lastPosition || selection.getRangeAt(0).getBoundingClientRect());

        const query = validInstance?.[0]?.trim().slice(prefix.length);

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

    // debounce the checkForMention function
    let checkTimeout: ReturnType<typeof setTimeout> = 0;
    const checkForMentionDebounced = () => {
        clearTimeout(checkTimeout);
        checkTimeout = setTimeout(checkForMention, 10);
    };

    const selectionChangeCallback = () => {
        const selection = document.getSelection()!;
        const anchorElement = selection!.anchorNode?.parentElement;

        if (!anchorElement) return;

        if (contentEditableElement.contains(anchorElement)) {
            lastSelection = selection;
            checkForMentionDebounced();
            return;
        }

        setTimeout(stop, 1);
    };

    const set = (mentionElement: HTMLElement) => {
        let range: Range;

        if (
            !mentionElement ||
            !validInstance ||
            typeof validInstance.index === 'undefined' ||
            !lastSelection
        ) {
            return;
        }

        // create range for the mention instance
        range = document.createRange();
        range.setStart(lastSelection.anchorNode!, validInstance.index + validInstance[0].indexOf(prefix));
        range.setEnd(lastSelection.anchorNode!, validInstance.index + validInstance[0].length);

        range.deleteContents();

        // create the mention element and insert it into the DOM
        const newElement = mentionElement.cloneNode(true) as HTMLElement;
        // we ensure that the mention element is not editable
        newElement.setAttribute('contenteditable', 'false');
        range.insertNode(newElement);

        // add a space after the mention element
        newElement.after(' ');

        // move the cursor to the space after the mention element
        range = document.createRange();
        range.setStart(newElement.nextSibling!, 1);
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
