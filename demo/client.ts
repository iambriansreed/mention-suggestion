import createMention, { Mention, EventProps } from './lib/index.js';

type Suggestion = {
    name: string;
    atomicNumber: number;
};

window.addEventListener('load', () => {
    // example
    {
        const example = document.querySelector<HTMLElement>('#example')!;
        const dropdownElement = example.querySelector<HTMLElement>('[data-suggestions]')!;
        const contentEditableElement = example.querySelector<HTMLElement>('[contenteditable]')!;
        const prefixInput = example.querySelector<HTMLInputElement>('[name="prefix"]')!;
        let suggestionItems: Suggestion[] = [];
        let selectedSuggestion = 0;

        const getSuggestions = async (query: string): Promise<Suggestion[]> => {
            const q = query.toLowerCase();
            return elements.filter((e) => e.name.toLowerCase().includes(q)).slice(0, 10);
        };

        const createMentionElement = (suggestion: Suggestion) => {
            const element = document.createElement('span');
            element.classList.add('mention');
            element.innerHTML = `${prefixValue()}${suggestion.name}`;
            element.dataset.mention = JSON.stringify(suggestion);
            return element;
        };

        const showDropdown = async ({ query, position }: EventProps) => {
            dropdownElement.innerHTML = '<li>Searching...</li>';
            dropdownElement.style.top = `${position.top + position.height}px`;
            dropdownElement.style.left = `${position.left}px`;
            dropdownElement.style.removeProperty('display');

            suggestionItems = (await getSuggestions(query)) || [];

            dropdownElement.innerHTML = !suggestionItems?.length
                ? `<li>No results found for ${query}</li>`
                : suggestionItems
                      .map((item, index) => {
                          const li = document.createElement('li');
                          li.classList.add('suggestion');
                          if (selectedSuggestion === index) li.classList.add('selected');
                          li.innerHTML = item.name;
                          li.dataset.index = index + '';
                          return li.outerHTML;
                      })
                      .join('');
        };

        const hideDropdown = () => {
            // hide dropdown and reset state
            dropdownElement.innerHTML = '';
            dropdownElement.style.display = 'none';
            suggestionItems = [];
            selectedSuggestion = 0;
        };

        const prefixValue = () => prefixInput.value.trim();

        let mention: Mention | undefined;

        const mountMention = () => {
            mention?.off();

            const prefix = prefixValue();

            if (!prefix) return;

            mention = createMention(prefix, contentEditableElement);

            mention.on('start', showDropdown);
            mention.on('update', showDropdown);
            mention.on('stop', hideDropdown);
        };

        mountMention();

        prefixInput.addEventListener('input', () => {
            mountMention();
        });

        contentEditableElement.addEventListener('keydown', (event) => {
            if (suggestionItems.length === 0) return;

            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                // we are arrowing with the suggestions dropdown open inside the contenteditable element
                event.preventDefault();
                event.stopPropagation();

                selectedSuggestion += event.key === 'ArrowUp' ? -1 : 1;
                if (selectedSuggestion < 0) selectedSuggestion = suggestionItems.length - 1;
                if (selectedSuggestion >= suggestionItems.length) selectedSuggestion = 0;

                dropdownElement.querySelectorAll('li').forEach((li, index) => {
                    if (index === selectedSuggestion) {
                        li.classList.add('selected');
                    } else {
                        li.classList.remove('selected');
                    }
                });
            }

            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                const suggestionItem = suggestionItems[selectedSuggestion];
                mention?.set(createMentionElement(suggestionItem));
            }

            return;
        });

        dropdownElement.addEventListener('click', (e) => {
            e.preventDefault();
            const item = (e.target as HTMLElement)?.closest<HTMLElement>('li[data-index]')!;
            const suggestionItem = suggestionItems[parseInt(item.dataset.index!, 10)];
            if (suggestionItem) mention?.set(createMentionElement(suggestionItem));
            mention?.stop();
        });
    }
});

const elements = [
    { name: 'Hydrogen', atomicNumber: 1 },
    { name: 'Helium', atomicNumber: 2 },
    { name: 'Lithium', atomicNumber: 3 },
    { name: 'Beryllium', atomicNumber: 4 },
    { name: 'Boron', atomicNumber: 5 },
    { name: 'Carbon', atomicNumber: 6 },
    { name: 'Nitrogen', atomicNumber: 7 },
    { name: 'Oxygen', atomicNumber: 8 },
    { name: 'Fluorine', atomicNumber: 9 },
    { name: 'Neon', atomicNumber: 10 },
    { name: 'Sodium', atomicNumber: 11 },
    { name: 'Magnesium', atomicNumber: 12 },
    { name: 'Aluminium', atomicNumber: 13 },
    { name: 'Silicon', atomicNumber: 14 },
    { name: 'Phosphorus', atomicNumber: 15 },
    { name: 'Sulfur', atomicNumber: 16 },
    { name: 'Chlorine', atomicNumber: 17 },
    { name: 'Argon', atomicNumber: 18 },
    { name: 'Potassium', atomicNumber: 19 },
    { name: 'Calcium', atomicNumber: 20 },
    { name: 'Scandium', atomicNumber: 21 },
    { name: 'Titanium', atomicNumber: 22 },
    { name: 'Vanadium', atomicNumber: 23 },
    { name: 'Chromium', atomicNumber: 24 },
    { name: 'Manganese', atomicNumber: 25 },
    { name: 'Iron', atomicNumber: 26 },
    { name: 'Cobalt', atomicNumber: 27 },
    { name: 'Nickel', atomicNumber: 28 },
    { name: 'Copper', atomicNumber: 29 },
    { name: 'Zinc', atomicNumber: 30 },
    { name: 'Gallium', atomicNumber: 31 },
    { name: 'Germanium', atomicNumber: 32 },
    { name: 'Arsenic', atomicNumber: 33 },
    { name: 'Selenium', atomicNumber: 34 },
    { name: 'Bromine', atomicNumber: 35 },
    { name: 'Krypton', atomicNumber: 36 },
    { name: 'Rubidium', atomicNumber: 37 },
    { name: 'Strontium', atomicNumber: 38 },
    { name: 'Yttrium', atomicNumber: 39 },
    { name: 'Zirconium', atomicNumber: 40 },
    { name: 'Niobium', atomicNumber: 41 },
    { name: 'Molybdenum', atomicNumber: 42 },
    { name: 'Technetium', atomicNumber: 43 },
    { name: 'Ruthenium', atomicNumber: 44 },
    { name: 'Rhodium', atomicNumber: 45 },
    { name: 'Palladium', atomicNumber: 46 },
    { name: 'Silver', atomicNumber: 47 },
    { name: 'Cadmium', atomicNumber: 48 },
    { name: 'Indium', atomicNumber: 49 },
    { name: 'Tin', atomicNumber: 50 },
    { name: 'Antimony', atomicNumber: 51 },
    { name: 'Tellurium', atomicNumber: 52 },
    { name: 'Iodine', atomicNumber: 53 },
    { name: 'Xenon', atomicNumber: 54 },
    { name: 'Cesium', atomicNumber: 55 },
    { name: 'Barium', atomicNumber: 56 },
    { name: 'Lanthanum', atomicNumber: 57 },
    { name: 'Cerium', atomicNumber: 58 },
    { name: 'Praseodymium', atomicNumber: 59 },
    { name: 'Neodymium', atomicNumber: 60 },
    { name: 'Promethium', atomicNumber: 61 },
    { name: 'Samarium', atomicNumber: 62 },
    { name: 'Europium', atomicNumber: 63 },
    { name: 'Gadolinium', atomicNumber: 64 },
    { name: 'Terbium', atomicNumber: 65 },
    { name: 'Dysprosium', atomicNumber: 66 },
    { name: 'Holmium', atomicNumber: 67 },
    { name: 'Erbium', atomicNumber: 68 },
    { name: 'Thulium', atomicNumber: 69 },
    { name: 'Ytterbium', atomicNumber: 70 },
    { name: 'Lutetium', atomicNumber: 71 },
    { name: 'Hafnium', atomicNumber: 72 },
    { name: 'Tantalum', atomicNumber: 73 },
    { name: 'Tungsten', atomicNumber: 74 },
    { name: 'Rhenium', atomicNumber: 75 },
    { name: 'Osmium', atomicNumber: 76 },
    { name: 'Iridium', atomicNumber: 77 },
    { name: 'Platinum', atomicNumber: 78 },
    { name: 'Gold', atomicNumber: 79 },
    { name: 'Mercury', atomicNumber: 80 },
    { name: 'Thallium', atomicNumber: 81 },
    { name: 'Lead', atomicNumber: 82 },
    { name: 'Bismuth', atomicNumber: 83 },
    { name: 'Polonium', atomicNumber: 84 },
    { name: 'Astatine', atomicNumber: 85 },
    { name: 'Radon', atomicNumber: 86 },
    { name: 'Francium', atomicNumber: 87 },
    { name: 'Radium', atomicNumber: 88 },
    { name: 'Actinium', atomicNumber: 89 },
    { name: 'Thorium', atomicNumber: 90 },
    { name: 'Protactinium', atomicNumber: 91 },
    { name: 'Uranium', atomicNumber: 92 },
    { name: 'Neptunium', atomicNumber: 93 },
    { name: 'Plutonium', atomicNumber: 94 },
    { name: 'Americium', atomicNumber: 95 },
    { name: 'Curium', atomicNumber: 96 },
    { name: 'Berkelium', atomicNumber: 97 },
    { name: 'Californium', atomicNumber: 98 },
    { name: 'Einsteinium', atomicNumber: 99 },
    { name: 'Fermium', atomicNumber: 100 },
    { name: 'Mendelevium', atomicNumber: 101 },
    { name: 'Nobelium', atomicNumber: 102 },
    { name: 'Lawrencium', atomicNumber: 103 },
    { name: 'Rutherfordium', atomicNumber: 104 },
    { name: 'Dubnium', atomicNumber: 105 },
    { name: 'Seaborgium', atomicNumber: 106 },
    { name: 'Bohrium', atomicNumber: 107 },
    { name: 'Hassium', atomicNumber: 108 },
    { name: 'Meitnerium', atomicNumber: 109 },
    { name: 'Darmstadtium', atomicNumber: 110 },
    { name: 'Roentgenium', atomicNumber: 111 },
    { name: 'Copernicium', atomicNumber: 112 },
    { name: 'Nihonium', atomicNumber: 113 },
    { name: 'Flerovium', atomicNumber: 114 },
    { name: 'Moscovium', atomicNumber: 115 },
    { name: 'Livermorium', atomicNumber: 116 },
    { name: 'Tennessine', atomicNumber: 117 },
    { name: 'Oganesson', atomicNumber: 118 },
];
