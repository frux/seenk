/**
 * Seenk.js
 * Flow controller powered by generators
 * @version 0.2.1
 */

/**
 *
 * @param iterator {Generator} Generator
 * @param resolve {function} Function resolves promise
 * @param reject {function} Function rejects promise
 * @param prevResult {*} Result of previous iteration
 * @private
 */
function _yieldIterator(iterator, resolve, reject, prevResult){
    var yieldResult;

    prevResult = prevResult || {};

    yieldResult = iterator.next(prevResult.value);

    if(yieldResult.done){
        resolve(yieldResult.value);
        return;
    }

    if(yieldResult.value instanceof Promise){
        return yieldResult.value
            .then(function(nextResult){
                _yieldIterator(iterator, resolve, reject, {value: nextResult, done: false});
            })
            .catch(function(err){
                return reject(err);
            })
    }else if(yieldResult.value instanceof Array){
        return Promise.all(yieldResult.value)
            .then(function(nextResult){
                _yieldIterator(iterator, resolve, reject, {value: nextResult, done: false});
            })
            .catch(function(err){
                return reject(err);
            })
    }else{
        return _yieldIterator(iterator, resolve, reject, yieldResult);
    }
}

/**
 * Handle your generator function
 * @param generator {function} Generator function
 * @returns {*}
 * @private
 */
function _synchronize(generator){

    //patch generator
    var iterable = generator();

    //run iterator and return promise
    return new Promise(function(resolve, reject){
        _yieldIterator(iterable, resolve, reject, {});
    });
}

/**
 * Syncronously map array of async functions
 * @param asyncStack {Array} Array of async functions
 * @returns {Array}
 */
function _map(asyncStack){

    //synchronously run all functions in asyncStack using generator
    return seenk(function*(){
        return yield asyncStack;
    });
}

/**
 * Handle your generator function
 * @param asyncStaff {function|Array} Generator function or an array of functions
 * @returns {*}
 */
function seenk(asyncStaff){

    //if function passed to seenk
    if(typeof asyncStaff === 'function'){

        //synchronize it
        return _synchronize(asyncStaff);

        //if passed an array
    }else if(asyncStaff instanceof Array){

        //map this array
        return _map(asyncStaff);
    }
}

/**
 * Wrap generator by function returning promise
 * @param generator {function} Generator function
 * @returns {function}
 */
seenk.wrap = function(generator){
    return function(){
        return seenk(generator);
    };
};

module.exports = seenk;