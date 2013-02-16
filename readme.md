three.d.ts
====
#### TypeScript interface for three.js ####

three.d.ts provides a type-safe and readable interface for **[three.js](http://mrdoob.github.com/three.js/)**.   
This porject is currently based on three.js **r56**. (You can also get [earlier three.d.ts versions](https://github.com/kontan/three.d.ts/tags))

### Downloads

You can get three.d.ts in the following ways:

* [DefinitelyTyped](https://github.com/borisyankov/DefinitelyTyped), The repository for type definitions
* [tsd](http://www.tsdpm.com/), A TypeScript definition package manager
* Download [only single three.d.ts file](https://github.com/kontan/three.d.ts/raw/master/three.d.ts) directly
* [Zipped whole of the project](https://github.com/kontan/three.d.ts/archive/master.zip) contains some examples. 

### HTML API Reference

[HTML API reference](http://phyzkit.net/docs/three.d.ts.html) is available. (Experimental, based r56)

### Usage (for beginners of TypeScript)

1. Download [three.js](https://raw.github.com/mrdoob/three.js/master/build/three.js) (latest three.js is recommended).
2. Download [three.d.ts](https://github.com/kontan/three.d.ts/raw/master/three.d.ts) and place it at any directory.
3. Create your TypeScript source file and write your application. If you want to know how to use classes in three.d.ts, examples in three.js are helpful. Usege of three.d.ts classes is all the same except for type checking.
4. Launch a shell and compile your source code. Compile your source file with three.d.ts as follows: 

    tsc three.d.ts yourcode.ts

5. Create your html file to invoke the generated JavaScript source code. Don't forget to refer both of three.js and yourcode.js from your html source file. 
6. Open the html file. 

Enjoy three.js :)

### TODO

* Prividing a lot more examples written in TypeScript. 