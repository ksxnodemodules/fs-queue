
(module => {
    'use strict';

    var FSPromise = require('./fs-promise.js');

    const RESOLVE = ({resolve, value}) => resolve(value);
    const REJECT = ({reject, error}) => reject(error);

    var createPromiseCreator = fsfunc =>
        (
            path,
            {
                onsuccess = RESOLVE,
                onerror = REJECT,
                onfinish = desc => desc.error ? onerror(desc) : onsuccess(desc),
                ignoreprev = false
            } = {},
            ...middle
        ) =>
            new FSPromise(path, ({resolve, reject, previous}) => {
                previous.error
                    ? ignoreprev ||
                        onfinish({
                            resolve, reject, __proto__: previous
                        })
                    : fsfunc(
                        path, ...middle,
                        (error, value) => onfinish({
                            resolve, reject, value, error
                        })
                    )
                ;
            })
    ;

    module.exports = createPromiseCreator;

})(module);
