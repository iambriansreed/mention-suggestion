# Mention

A deceptively simple library for adding mention support to contenteditable elements. It is designed to be small, flexible, and easy to use. It has no dependencies and is written in vanilla JavaScript. How the suggestions are displayed is up to you. The library only handles specific events.

## Syntax

```javascript
import createMention from 'mention';

const mention = createMention(prefix, contenteditable);

mention.on('start', (event) => {
    // show dropdown
});

mention.on('update', (event) => {
    // change suggestions in dropdown
});

mention.on('stop', (event) => {
    // hide dropdown
});

function onDropdownItemSelected(item) {
    mention.set(createMentionElement(item));
    // trigger the stop the mention event to hide the dropdown after the suggestion is selected
    mention.stop();
}

function stopListeningForMentionEvents() {
    mention.off();
}
```

### Parameters

`prefix` (required)

The prefix is the character that triggers the mention `start` event. It is used to identify the beginning of a mention. For example, in Twitter, the prefix is the '@' character.

`contenteditable` (required)

The contenteditable element is the element that the user interacts with to create mentions. The library listens for the `input` event and selection changes on this element to trigger the mention.

### Returns

The library returns an object with the following methods:

-   `on` - event listener with that fires the following events
    -   `start` - Triggers when the cursor is in the mention range.
    -   `update` - Triggers when the query changes and the cursor is still in the mention range.
    -   `stop` - Triggers when the cursor is no longer in the range of a mention.
-   `off` - Removes all event listeners on the content editable.
-   `set` - Replaces the mention text and prefix with an html element.
-   `stop` - Manually fire the stop event even if the cursor is in the mention range.
