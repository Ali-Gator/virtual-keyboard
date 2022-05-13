export default class Keyboard {
  constructor(values, codes, fnCodes) {
    this._lang = localStorage.getItem('lang') || 'ru';
    this._values = values;
    this._codes = codes;
    this._fnCodes = fnCodes;
    this._newValues = {};
    this._codes.forEach((code, ind) => {
      this._newValues[code] = {};
      Object.keys(this._values)
        .forEach((key) => {
          this._newValues[code][key] = this._values[key][ind];
        });
    });
  }

  renderKeyboard() {
    const root = document.querySelector('.page');
    const keyboard = this._createElem('div', 'keyboard');
    const title = this._createElem('h1', 'keyboard__title', 'Виртуальная клавиатура');
    this._textarea = this._createElem('textarea', 'keyboard__textarea');
    const wrapper = this._createElem('div', 'keyboard__wrapper');
    const text1 = this._createElem('p', 'keyboard__text', 'Для переключения языка используйте Command+Shift с левой стороны');
    const text2 = this._createElem('p', 'keyboard__text', 'Клавиатура создана в операционной среде MacOS');

    keyboard.appendChild(title);
    keyboard.appendChild(this._textarea);
    keyboard.appendChild(wrapper);
    keyboard.appendChild(text1);
    keyboard.appendChild(text2);
    root.appendChild(keyboard);
    this._createKeys(this._lang, wrapper);
    this._addKeyboardEventListeners();
    this._turnOffTextareaInput();
    this._typeKeyboard = document.querySelector('.keyboard__panel_active');
    [, this._classNameKeyboard] = this._typeKeyboard.classList;
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
        const button = this._createElem('button', ['key', this._codes[key]], this._values[lang][key], 'button');

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

  _toggleType(type) {
    if (type === undefined) {
      const lang = this._classNameKeyboard.slice(0, 2);
      if (lang === 'ru') {
        this._classNameKeyboard = `en${this._classNameKeyboard.slice(2)}`;
        localStorage.setItem('lang', 'en');
      } else {
        this._classNameKeyboard = `ru${this._classNameKeyboard.slice(2)}`;
        localStorage.setItem('lang', 'ru');
      }
    } else if (this._classNameKeyboard.endsWith('Shift') || this._classNameKeyboard.endsWith('Caps')) {
      this._classNameKeyboard = this._classNameKeyboard.slice(0, 2);
    } else {
      this._classNameKeyboard = `${this._classNameKeyboard}${type}`;
    }

    const newTypeKeyboard = document.querySelector(`.${this._classNameKeyboard}`);
    type === 'Caps' && document.querySelectorAll('.CapsLock')
      .forEach((btn) => btn.classList.toggle('key_pressed'));

    this._typeKeyboard.classList.remove('keyboard__panel_active');
    newTypeKeyboard.classList.add('keyboard__panel_active');
    this._typeKeyboard = newTypeKeyboard;
  }

  _addPointerEventListeners(el) {
    el.addEventListener('mousedown', (e) => {
      e.target.classList.add('key_active');
      if (e.target.textContent === 'Shift') {
        this._toggleType('Shift');
        e.target.classList.remove('key_active');
      }
    });

    el.addEventListener('mouseup', (e) => {
      e.target.classList.remove('key_active');
      if (e.target.textContent === 'Backspace') {
        if (this._textarea.textLength > 0) {
          this._textarea.value = this._textarea.value.slice(0, this._textarea.textLength - 1);
        }
      } else if (e.target.textContent === 'Tab') {
        this._textarea.value += '    ';
      } else if (e.target.textContent === 'Enter') {
        this._textarea.value += '\n';
      } else if (e.target.textContent === 'Shift') {
        this._toggleType('Shift');
      } else if (e.target.textContent === 'Caps Lock') {
        this._toggleType('Caps');
      } else if (e.target.textContent === 'Control' || e.target.textContent === 'Opt' || e.target.textContent === 'Command') {
        return;
      } else {
        this._textarea.value += e.target.textContent;
      }

      this._textarea.focus();
      this._textarea.selectionStart = this._textarea.textLength;
    });
  }

  _addKeyboardEventListeners() {
    document.addEventListener('keydown', (e) => {
      this._keyValue = this._newValues[e.code][this._classNameKeyboard];

      if (e.code === 'Backspace') {
        return;
      } if (e.code === 'Tab') {
        this._textarea.value += '    ';
      } else if (e.code === 'Enter') {
        this._textarea.value += '\n';
      } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this._shiftPressed = true;
        !this._metaPressed && this._toggleType('Shift');
      } else if (e.code === 'CapsLock') {
        this._toggleType('Caps');
      } else if (e.code === 'MetaLeft') {
        this._metaPressed = true;
      } else if (!this._fnCodes.includes(e.code)) {
        this._textarea.textLength === 0
          ? this._textarea.value = this._keyValue
          : this._textarea.value = this._textarea.value.slice(0, e.target.selectionStart) + this._keyValue + this._textarea.value.slice(e.target.selectionStart);
      }
      this._toggleActiveBtnClass(e, true);
    });

    document.addEventListener('keyup', (e) => {
      this._toggleActiveBtnClass(e, false);
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        !this._metaPressed && this._toggleType('Shift');
        if (this._metaPressed && this._shiftPressed) {
          this._toggleType();
          this._metaPressed = false;
        }
        this._shiftPressed = false;
      }
      this._textarea.focus();
    });
  }

  _turnOffTextareaInput() {
    this._textarea.addEventListener('input', (e) => {
      if (e.inputType === 'insertText') {
        this._textarea.value = this._textarea.value.slice(0, this._textarea.textLength - 1);
      } else if (e.inputType === 'insertLineBreak') {
        this._textarea.value = this._textarea.value.slice(0, this._textarea.textLength - 1);
      }
    });
  }

  _toggleActiveBtnClass(e, isActive) {
    this._activeBtn = this._typeKeyboard.querySelector(`.${e.code}`);
    isActive
      ? this._activeBtn.classList.add('key_active')
      : this._activeBtn.classList.remove('key_active');
  }
}
