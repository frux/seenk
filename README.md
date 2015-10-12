# seenk [![Build Status](https://travis-ci.org/frux/seenk.svg?branch=master)](https://travis-ci.org/frux/seenk)

Flow controller for node.js

## Run tests
``npm i``

``npm test``

## Install
``npm i seenk``

## Use

Let we have some async function named blaBlaBla returning Promise.
```js
function blaBlaBla(text, delay){
    delay = Number(delay) || 0;

    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve(text);
        }, delay);
    });
}
```

### Seenk(generatorFunction) : Promise

If you need some async functions to be executed synchronously you should wrap it by generator function and use Seenk:

```js
Seenk(function*(){
    var greeting = '';

    greeting += (yield blaBlaBla('Hello', 100)) +
        (yield blaBlaBla(' ', 300)) +
        (yield blaBlaBla('World', 300)) +
        (yield blaBlaBla('!'));

    return greeting;
})
```

All of this blaBlaBla will be executed by turns.

Also Seenk returns you a Promise to allow you getting result of generator function.

```js
Seenk(function*(){
    var greeting = '';

    greeting += (yield blaBlaBla('Hello', 100)) +
        (yield blaBlaBla(' ', 300)) +
        (yield blaBlaBla('World', 300)) +
        (yield blaBlaBla('!'));

    return greeting;
}).then(function(greeting){
    console.log(greeting);
  });
```
This outputs ``Hello World!`` into console after 700ms.


### Seenk(Array) : Promise

If you need to get results of some independent async functions running parallely

```js
Seenk([
    blaBlaBla('Hello', 100),
    blaBlaBla(' ', 200),
    blaBlaBla('World', 300),
    blaBlaBla('!', 500)
])
```

Seenk will return you a Promise which will resolve ``Hello World!`` in 500ms after the longest delay will pass.

### Seenk.wrap(generatorFunction) : Function

```js
var wrapped = Seenk.wrap(function*(){
    var message = '';

    message += (yield blaBlaBla('Wrap', 100)) +
        (yield blaBlaBla(' ', 200)) +
        (yield blaBlaBla('me', 300)) +
        (yield blaBlaBla('!'));

    return message;
})
```

And now you have function ``wrapped`` returning Promise.
