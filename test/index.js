var Seenk = require('../index.js');

function blaBlaBla(text, delay){
    delay = Number(delay) || 0;

    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve(text);
        }, delay);
    });
}

describe('General tests', function(){

    it('Generator function', function(done){
        //Seenk generator test
        Seenk(function*(){
            var greeting = '';

            greeting += (yield blaBlaBla('Hello', 100)) +
                (yield blaBlaBla(' ', 300)) +
                (yield blaBlaBla('World', 300)) +
                (yield blaBlaBla('!'));

            return greeting;
        })
            .then(function(result){
                (result === 'Hello World!') && done();
            });
    });


    it('Generator wrapping', function(done){
        //Seenk.wrap test
        (Seenk.wrap(function*(){
            var message = '';

            message += (yield blaBlaBla('Wrap', 100)) +
                (yield blaBlaBla(' ', 200)) +
                (yield blaBlaBla('me', 300)) +
                (yield blaBlaBla('!'));

            return message;
        }))()
            .then(function(result){
                (result === 'Wrap me!') && done();
            });
    });


    it('Array of promises', function(done){
        //Seenk array
        Seenk([
            blaBlaBla('This', 100),
            blaBlaBla('test', 200),
            blaBlaBla('has', 300),
            blaBlaBla('been', 400),
            blaBlaBla('passed', 500),
            blaBlaBla('successfully', 600)
        ])
            .then(function(result){
                (result.join(' ') === 'This test has been passed successfully') && done();
            });
    });
});