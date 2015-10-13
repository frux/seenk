/**
 * Seenk.js
 * Flow controller powered by generators
 * @version 0.2.0
 */

/**
 *
 * @param iterator {Generator} Generator
 * @param resolve {function} Function resolves promise
 * @param prevResult {*} Result of previous iteration
 * @private
 */
function _yieldIterator(iterator, resolve, prevResult){
    var yieldResult;

    prevResult = prevResult || {};

    yieldResult = iterator.next(prevResult.value);

    if(yieldResult.done){
        resolve(yieldResult.value);
        return;
    }

    if(yieldResult.value instanceof Promise){
            yieldResult.value.then(function(nextResult){
                _yieldIterator(iterator, resolve, { value: nextResult, done: false });
            });
    }else{
        _yieldIterator(iterator, resolve, yieldResult);
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
        _yieldIterator(iterable, resolve, {});
    });
}

/**
 * Syncronously map array of async functions
 * @param asyncStack {Array} Array of async functions
 * @returns {Array}
 */
function _map(asyncStack){
    var results = [];

    //synchronously run all functions in asyncStack using generator
    return _synchronize(function*(){

        //if stack is not empty
        while(asyncStack.length){

            //push result of function in array
            results.push(yield asyncStack.shift());
        }

        //return array of results
        return results;
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