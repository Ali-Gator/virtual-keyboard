import './index.css';
import { codes, fnCodes, keyValues } from './assets/constants.js';
import Keyboard from './components/Keyboard';

const keyboard = new Keyboard(keyValues, codes, fnCodes);
keyboard.renderKeyboard();
