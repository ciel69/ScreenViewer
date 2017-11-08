import {Observable} from 'rxjs/Rx';


/**
 * Map of screen types dependensed of screen width
 * @type {Object}
 */
let __screenMap__ = {

    // Common types
    // Everything is less
    map: {
        '768': 'mobile',
        '990': 'tablet',
        '1260': 'tabletLandscape',
        '1760': 'desktop'
    },

    // Value as default
    default: 'desktopFull'
};

/**
 * Module name
 * @type {String}
 */
const __name__ = 'ScreenViewer';

/**
 * Get module name
 * @return {String} module name
 */
const getModuleName = () => __name__;

/**
 * Get common screen map
 * @return {Object} map
 */
const getScreenMap = () => __screenMap__.map;

/**
 * Get default screen type
 * @return {Object} default type
 */
const getScreenMapDefault = () => __screenMap__.default;

/**
 * Setup user screen map
 *
 * @param  {Object} screenMap
 *
 * @return {Object} return new screen map
 */
const __setScreenMap__ = (screenMap) => {
    __screenMap__ = screenMap;

    return __screenMap__
};

/**
 * Method for init module, call for init observer
 *
 * @param {Array} observableList список потоков, обрабатывая которые, нужно проверять ширину экрана
 *                               по-умолчанию, передаем
 *
 *                               observable.on('load').map(() => window.innerWidth)
 *                               observable.on('ready').map(event => event.target.innerWidth)
 *                               observable.on('ready').map(event => event.target.innerWidth)
 *
 * @return {Rx} Поток изменяемой ширины и типов (приходит от совмещения других потоков)
 *              изменяется только тогда, когда меняется значение типа
 */
const __init__ = (observableList) => {
    if (!Array.isArray(observableList) || observableList.length < 1) {
        throw new Error(`Module ${__name__}, to method init$, should pass an array with observables`)
    }

    /**
     * Map of screen types
     * @type {Object}
     */
    let screenMap = getScreenMap();

    /**
     * Screen type as default
     * @type {String}
     */
    let screenMapDefault = getScreenMapDefault();

    /**
     * Observable from screen map
     * @type {Rx}
     */
    let screenMap$;

    // Setup screen types flow
    screenMap$ = Observable.from(
        Object.keys(screenMap)
    );

    /**
     * Association observable of widths (from merge passed observables)
     * @type {Rx}
     */
    return Observable
        .merge(...observableList)
        .filter(width => !!width)
        .switchMap(width => {
            return screenMap$
                .filter(widthOfMap => width <= +widthOfMap)
                .map(widthOfMap => widthOfMap ? screenMap[widthOfMap] : widthOfMap)
                .defaultIfEmpty(screenMapDefault)
                .first()
                .map(type => {
                    return {
                        width,
                        type
                    }
                })
        })
        .distinctUntilChanged((prev, cur) => prev.type === cur.type)
};

const

    /**
     * Установить новую карту типов экрана
     *
     * @param  {Object} userScreenMap пользовательская карта разрешений
     *
     * @return {Function} возвращаем метод инициализации, формирую цепочку
     *
     */
    setup = (userScreenMap) => {
        __setScreenMap__(userScreenMap);

        return __init__
    };

export default {

    getModuleName,

    getScreenMap,

    getScreenMapDefault,

    setup,

    init$: __init__

}