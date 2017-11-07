
# RxJS ScreenViewer
Module for definition screen type by RXJS. There is Flow in code.

For why? More comfortably using adaptive site created by screen types, than using particular sizes. This addition absctract layer give to you flexible and maintainable.

## How it works
Module define some kind of size (in this case it's screen width), that it receive and compare it with needed screen type.

For example, module receive value 940, that corresponds screen type tablet. All corresponds values are shown below. If value is 1300, then it will be desktop.

```js
/**
 * Screen types map
 * @type {Object}
 */
screenMap = {

    // Everything is less
    map: {
        '768': 'mobile',
        '990': 'tablet',
        '1260': 'tabletLandscape',
        '1760': 'desktop'
    },

    // type as default
    default: 'desktopFull'
}
```

Module works by Rx streams. In our case it works with resizes of screen. Which is stream will be observable decide developer.

In common cases uses free streams by three events:
    - Full page loaded (onload)
    - Full document loaded (DOMContentLoaded)
    - Resize screen (onresize).
    
Tracked default events used inside the library
```js
        [
            Observable.fromEvent(window, 'load').map(() => window.innerWidth),
            Observable.fromEvent(document, 'DOMContentLoaded').map(event => event.target.innerWidth),
            Observable.fromEvent(window, 'resize').map(() => window.innerWidth),
        ]
```

## Install
    
To install using npm or yarn
```npm
npm install screen-viewer --save
    
yarn add screen-viewer
```


## Usage
Set module (it use RxJS, that why module shold be accessible in environment).

index.js:

```js
import ScreenViewer from 'screen-viewer';
import Rx, { Observable } from 'rxjs/Rx';

const customEvent = new Rx.Subject();

const screen$ = new ScreenViewer(
      {
      
          // Common types
          map: {
              '320': 'mobile',
              '700': 'tablet'
          },
      
          // You can set up types map, if you need it. 
          default: 'desktop'
      }, // You can configure the card types, if you need it. If you do not want to put null
      [Observable.of(customEvent).map(() => window.innerWidth)] // Add a custom event. If you do not need to specify
    );

```

Now we can subscribe to stream, that will change data in moment when type of screen changed.

```js
screen$.subscribe(console.log)
```