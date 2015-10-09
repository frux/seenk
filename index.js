/**
 * Seenk.js
 * Flow controller powered by generators
 * @version 0.0.1
 */

//save original .next() method
var _originalNext = (function*(){})().constructor.prototype.next,

    //construct new .next() method
    _newNext = function(yieldData){

        //call original method
        var yieldResult = _originalNext.call(this, yieldData),
            yieldValue;

        //if generator is done
        if(yieldResult.done){

            //just return result
            return yieldResult;
        }

        //if value fo yield is Promise
        if(!(yieldResult.value instanceof Promise)){

            //let it be a yield value
            yieldValue = yieldResult.value;

            //if value is not a promise
        }else{

            //wrap it by a promise
            yieldValue = new Promise(function(resolve, reject){
                resolve(yieldResult.value);
            });
        }

        //return patched yield result
        return {
            done: false,
            value: yieldValue
        };
    };

/**
 * Patch to apply to generator. Patch .next() method.
 * @returns {Generator}
 * @private
 */
function _patch(){

    //replace original method by patched one
    this.next = _newNext.bind(this);

    return this;
}

/**
 * Iterates yields
 * @param iterable {Generator} Generstor object
 * @param yieldValue {*} Value of previous yield
 * @returns {Promise}
 * @private
 */
function _yieldIterator(iterable, yieldValue){

    //return a promise
    return new Promise(function(resolve, reject){

        //if result of yield is a promise
        if(yieldValue instanceof Promise){

            //then promise resolves
            yieldValue.then(function(nextYieldValue){

                //run new iteration
                resolve(_yieldIterator(iterable, iterable.next(nextYieldValue).value));
            });

            //if yield returns not a promise
        }else{

            //resolve this value;
            resolve(yieldValue);
        }
    });
}

/**
 * Handle your generator function
 * @param generator {function} Generator function
 * @returns {*}
 * @private
 */
function _synchronize(generator){

    //patch generator
    var iterable = _patch.apply(generator());

    //run iterator
    return _yieldIterator(iterable, iterable.next().value);
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