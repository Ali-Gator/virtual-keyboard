import './index.css';
import {keyValues} from './assets/constants.js';

class Keyboard {
    constructor(values) {
        this._values = values;
    }

    renderKeyboard(rootClassName) {
        const root = document.querySelector(rootClassName);
        const keyboard = this._createElem('div', 'keyboard');
        const title = this._createTitle();
        const textarea = this._createElem()
    }

    _createElem(tag, classNames, type) {
        const elem = document.createElement(tag);
        if (type) {
            elem.type = 'type';
        }
        elem.classList.add(...classNames);
        return elem;
    }

    _createTitle() {
        const title = this._createElem('h1', ['keyboard__title']);
        title.textContent = 'Виртуальная клавиатура';
        return title;
    }
}

new Keyboard(keyValues).renderKeyboard('.page');

// фабрика по созданию элементов: принимает объект с ключами-тэгами-объекатми, в которых ключ класс и опционально ключи-аттрибуты