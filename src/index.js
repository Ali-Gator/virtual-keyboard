import './index.css';
import {keyValues} from './assets/constants.js';
import {Keyboard} from './components/Keyboard';

const keyboard = new Keyboard(keyValues);
keyboard.renderKeyboard('ru');