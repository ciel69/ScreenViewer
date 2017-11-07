import screenViewer from './screenViewer';
import {Observable} from 'rxjs/Rx';

export default class ScreenViewer {
    constructor(map, event) {
        if (typeof map !== 'undefined' && map !== null) {
            screenViewer.setup(map);
        }

        const targetEventList = [
            Observable.fromEvent(window, 'load').map(() => window.innerWidth),
            Observable.fromEvent(document, 'DOMContentLoaded').map(event => event.target.innerWidth),
            Observable.fromEvent(window, 'resize').map(() => window.innerWidth),
        ];

        if (typeof event !== 'undefined' && event !== null) {
            targetEventList.push(...event);
        }

        return screenViewer.init$(targetEventList);
    }
}
