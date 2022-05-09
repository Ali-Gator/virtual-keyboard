import './index.css';
import {keyValues, codes, fnCodes} from './assets/constants.js';
import {Keyboard} from './components/Keyboard';

const keyboard = new Keyboard(keyValues, codes, fnCodes);
keyboard.renderKeyboard('ru');


