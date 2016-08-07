
(() => {
    'use strict';

    var fs = require('fs');
    var createFunction = require('./create-function.js');

    [
        'access', 'exists', 'open', 'close', 'stat', 'fstat', 'lstat',
        'readFile', 'writeFile', 'truncate', 'ftruncate', 'fdatasync',
        'readdir', 'mkdir', 'chmod', 'fchmod', 'rename', 'read', 'fsync',
        'link', 'unlink', 'symlink', 'readlink'
    ].forEach(fname =>
        exports[fname] = createFunction(fs[fname])
    );

})();
