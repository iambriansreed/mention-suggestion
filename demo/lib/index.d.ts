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
export default function createMention(prefix: string, contentEditableElement: HTMLElement): Mention;
