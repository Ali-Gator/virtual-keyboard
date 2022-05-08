export class Keyboard {
    constructor(values) {
        this._values = values;
    }

    renderKeyboard(lang) {
        const root = document.querySelector('.page');
        const keyboard = this._createElem('div', 'keyboard');
        const title = this._createElem('h1', 'keyboard__title', 'Виртуальная клавиатура');
        this._textarea = this._createElem('textarea', 'keyboard__textarea');
        const wrapper = this._createElem('div', 'keyboard__wrapper');
        const text1 = this._createElem('p', 'keyboard__text', 'Для переключения языка используйте долгое нажатие на Caps Lock');
        const text2 = this._createElem('p', 'keyboard__text', 'Клавиатура создана в операционной среде MacOS');

        this._createKeys(lang, wrapper);
        this._addKeyboardEventListeners();
        keyboard.appendChild(title);
        keyboard.appendChild(this._textarea);
        keyboard.appendChild(wrapper);
        keyboard.appendChild(text1);
        keyboard.appendChild(text2);
        root.appendChild(keyboard);

        return root;
    }

    _createElem(tag, classNames, textContent, type) {
        const elem = document.createElement(tag);

        if (type) {
            elem.type = type;
        }

        if (textContent) {
            elem.textContent = textContent;
        }
        Array.isArray(classNames)
            ? elem.classList.add(...classNames)
            : elem.classList.add(classNames);
        return elem;
    }

    _createKeys(activeLang, parentEl) {

        for (const lang in this._values) {
            const panel = this._createElem('div', ['keyboard__panel', lang]);
            let key = 0;

            activeLang === lang && panel.classList.add('keyboard__panel_active');
            while (key < this._values[lang].length) {
                const button = this._createElem('button', 'key', this._values[lang][key], 'button');

                (key === 13 || key === 14 || key === 54 || key === 56 || key === 58) && button.classList.add('key_width_m');
                (key === 28 || key === 40) && button.classList.add('key_width_l');
                key === 41 && button.classList.add('key_width_xl');
                key === 57 && button.classList.add('key_width_xxl');

                this._addPointerEventListeners(button);
                panel.appendChild(button);
                key++;
            }

            parentEl.appendChild(panel);
        }
    }

    _toggleType(e, type) {
        const curTypeKeyboard = e.target.parentElement;
        const curClass = curTypeKeyboard.classList[1];
        let newTypeKeyboard;

        if (curClass.endsWith(`Shift`) || curClass.endsWith(`Caps`)) {
            newTypeKeyboard = document.querySelector(`.${curClass.slice(0, 2)}`);
        } else {
            newTypeKeyboard = document.querySelector(`.${curClass}${type}`);
            type === 'Caps' && newTypeKeyboard.querySelectorAll('.key_width_l')[0].classList.add('key_pressed');
        }

        curTypeKeyboard.classList.toggle('keyboard__panel_active');
        newTypeKeyboard.classList.toggle('keyboard__panel_active');
    }

    _addPointerEventListeners(el) {
        el.addEventListener('mousedown', (e) => {
            e.target.classList.add('key_active');
            if (e.target.textContent === 'Shift') {
                this._toggleType(e, 'Shift');
                e.target.classList.remove('key_active');
            }
        });

        el.addEventListener('mouseup', (e) => {
            e.target.classList.remove('key_active');
            if (e.target.textContent === 'Backspace') {
                if (this._textarea.textLength > 0) {
                    this._textarea.textContent = this._textarea.textContent.slice(0, this._textarea.textLength - 1);
                }
            } else if (e.target.textContent === 'Tab') {
                this._textarea.textContent += '    ';
            } else if (e.target.textContent === 'Enter') {
                this._textarea.textContent += '\n';
            } else if (e.target.textContent === 'Shift') {
                this._toggleType(e, 'Shift');
            } else if (e.target.textContent === 'Caps Lock') {
                this._toggleType(e, 'Caps');
            } else if (e.target.textContent === 'Control' || e.target.textContent === 'Opt' || e.target.textContent === 'Command') {
                return;
            } else {
                this._textarea.textContent += e.target.textContent;
            }

            this._textarea.focus();
            this._textarea.selectionStart = this._textarea.textLength;
        });
    }

    _addKeyboardEventListeners() {
        document.addEventListener('keypress', (e) => {
            this._textarea.textContent += e.key;
            this._textarea.selectionStart = this._textarea.textLength;
            // this._textarea.focus();
        });

        document.addEventListener('keydown', (e) => {
            const keyboardButtons = document.querySelectorAll('.key');
            keyboardButtons.forEach(btn => {
                if (e.key === btn.textContent) {
                    btn.classList.add('key_active');
                }
            });
        });
    }
}