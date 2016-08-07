
(module => {
    'use strict';

    var {Yield} = require('x-iterable-base/template');
    var ExtendedPromise = require('extended-promise');

    var {
        resolve: resolvePath
    } = require('path');

    var {
        create,
        getOwnPropertyNames
    } = Object;

    var {iterator} = Symbol;

    var promiseset = create(null);

    class FSPromise extends ExtendedPromise {

        constructor(path, callback) {

            if (typeof path !== 'string') {
                return super(path);
            }

            path = resolvePath(path);

            var waiting = Promise.all(
                new Yield(FSPromise).filterOnce(
                    ({path: lpath}) =>
                        !(lpath.indexOf(path) && path.indexOf(lpath))
                ).map(
                    ({promise}) => promise
                )
            );

            promiseset[path] = super(

                (resolve, reject) => {

                    var shared = {
                        resolve, reject, path
                    };

                    waiting.then(

                        value => callback({
                            previous: {value},
                            __proto__: shared
                        }),

                        error => callback({
                            previous: {error},
                            __proto__: shared
                        })

                    );

                }

            );

            var finalize = () => delete promiseset[path];
            this.onfinish(finalize, finalize);

        }

        static [iterator]() {
            return getOwnPropertyNames(promiseset)
                .map(path => new PromisePair(path, promiseset[path]))
                [iterator]()
            ;
        }

    }

    class PromisePair extends Array {

        get path() {
            return this[0];
        }

        get promise() {
            return this[1];
        }

    }

    module.exports = class extends FSPromise {};

})(module);
