bo [angular-freebox-authentication][![Build Status](https://travis-ci.org/xelita/angular-freebox-authentication.png?branch=master)](https://travis-ci.org/xelita/angular-freebox-authentication)

AngularJS authentication module to use Freebox OS API (http://dev.freebox.fr/sdk/os/).

## Quick start

+ Include freeboxAuthenticationModule.js in your application.

```html
<script src="js/freeboxAuthenticationModule.js"></script>
```

or use the minified version:

```html
<script src="js/freeboxAuthenticationModule.min.js"></script>
```

+ Add the module `freeboxAuthenticationModule` as a dependency to your app module:

```javascript
var myapp = angular.module('myapp', ['freeboxAuthenticationModule']);
```

+ Use the fbAuthenticationService as controller dependency and call fbAuthenticationService API:

```javascript
$scope.sampleApiRequestUrl = function() {
    fbAuthenticationService.apiRequestUrl('/login').then(function (url) {
        $log.debug('API url is: ' + url);
    });
};
```

## Developers

Clone the repo, `git clone git://github.com/xelita/angular-freebox-authentication.git`.
The project is tested with `jasmine` running on `karma`.

``` bash
$ npm install
$ npm run bower
$ npm test
```

## Contributing

Please submit all pull requests the against master branch. If your unit test contains JavaScript patches or features, you should include relevant unit tests. Thanks!

## Copyright and license

    The MIT License (MIT)

    Copyright (c) 2014 The Enlightened Developer

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
