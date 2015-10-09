var Seenk = require('../index.js');

function blaBlaBla(text, delay){
    delay = Number(delay) || 0;

    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve(text);
        }, delay);
    });
}

function startProfiling(){
    var startTime = +new Date();

    return function(){
        return +new Date() - startTime;
    };
}

var stopMapProfiling = startProfiling();
Seenk([
    blaBlaBla('This', 203),
    blaBlaBla('test', 340),
    blaBlaBla('has', 3000),
    blaBlaBla('been', 1003),
    blaBlaBla('passed', 214),
    blaBlaBla('successfully', 386)
])
    .then(function(msg){
        console.log({
            result: msg.join(' '),
            time: stopMapProfiling()
        });
    });

Seenk(function*(){
    var greeting = '',
        stopProfiling = startProfiling();

    greeting += (yield blaBlaBla('Hello', 504)) +
                (yield blaBlaBla(' ',     496)) +
                (yield blaBlaBla('World', 1000)) +
                (yield blaBlaBla('!'));

    return {
        result: greeting,
        time: stopProfiling()
    };
})
    .then(function(greeting){
        console.log(greeting);
    });