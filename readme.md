three.d.ts
====
#### TypeScript interface for three.js ####

three.d.ts provides a type-safe and readable interface for **[three.js](http://mrdoob.github.com/three.js/)**.   
This porject is currently based on three.js **r55**. (You can also get [three.d.ts r53 or r54](https://github.com/kontan/three.d.ts/tags))

### Download

[only single three.d.ts file](https://github.com/kontan/three.d.ts/raw/master/three.d.ts) or [zipped whole of the project](https://github.com/kontan/three.d.ts/archive/master.zip) contains some examples.

### API Reference

[HTML API reference](http://phyzkit.net/docs/three.d.ts.html) is available. (Experimental, based r55)




### Usage (for beginners of TypeScript)

1. Download [three.js](https://github.com/mrdoob/three.js/tags) (three.js **r55** is recommended) and unzip it.
2. Download [three.d.ts](https://github.com/kontan/three.d.ts/raw/master/three.d.ts) and place it at any directory.
3. Create your TypeScript source file. 
4. To reference three.d.ts from your typescript code, write the following special comment at the top of the your source file:

     /// &lt;reference path="path/to/three.d.ts" /&gt;

 The compiler will search type names and identifiers from the file. 
 Even if you write a wrong path to the TypeScript ambient source file, the compiler will not complain about missing the file :-( 
 The compiler will just says "The name 'THREE' does not exists in the current scope." 
 Be careful about the path.


5. Write your application. If you want to know how to use classes in three.d.ts, examples in three.js are helpful. Usege of three.d.ts classes is all the same except for type checking.
5. Launch a shell and compile your source code.
6. Create your html file to invoke the generated JavaScript source code. Don't forget to refer both of three.js and yourcode.js from your html source file. The previous special comment line does not influence the generated JavaScript. 
6. Open the html file. If your application doesn't work, [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) is useful to debug.  

Enjoy three.js!

### Demo

[http://kontan.github.com/three.d.ts](http://kontan.github.com/three.d.ts)

### TODO

* Prividing a lot more examples written in TypeScript. 