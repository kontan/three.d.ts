three.d.ts
====
#### TypeScript interface for three.js ####

three.d.ts provides a type-safe and readable interface for **[three.js](http://mrdoob.github.com/three.js/)**.   
This porject is currently based on three.js **r54**. (You can also get [three.d.ts r53](https://github.com/kontan/three.d.ts/tags))

### Download

[only three.d.ts](https://github.com/kontan/three.d.ts/raw/master/three.d.ts) or [zipped whole of the project](https://github.com/kontan/three.d.ts/archive/master.zip) contains some examples.

### Usage (for beginners of TypeScript)

1. Download [three.js](https://github.com/mrdoob/three.js/tags) (three.js r54 is recommended) and unzip it.
2. Download [three.d.ts](https://github.com/kontan/three.d.ts/raw/master/three.d.ts) and place it at any directory.
3. Create your TypeScript source file. 
4. To reference three.d.ts from your typescript code, write the following special comment at the top of the your source file:

     /// &lt;reference path="path/to/three.d.ts" /&gt;

 The compiler will search type names and identifiers from the file. 
 Even if you write a wrong path to the TypeScript ambient source file, the compiler will not complain about missing the file :-( 
 The compiler will just says "The name 'THREE' does not exists in the current scope." 
 Be careful about the path.


5. Write your application. If you want to refer a API reference, watch [official API reference](http://mrdoob.github.com/three.js/docs/54/) (a little out of date) or read three.d.ts. 
5. Launch a shell and compile the your code.
6. Create your html file to invoke the generated JavaScript source code. Don't forget to refer both of three.js and yourcode.js from your html source file. The previous special comment line does not influence the generated JavaScript. 
6. Open the html file. If your application doesn't work, [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) is useful to debug.  

Enjoy three.js!

### Demo

[http://kontan.github.com/three.d.ts](http://kontan.github.com/three.d.ts)

### TODO

*  Currently, a automatically-generated reference is not provided because there is no document generator for TypeScript. If it is released, I intend to provide a API reference generated from three.d.ts. It would be very helpful for not only TypeScript users but also JavaScript users.

* Prividing a lot of examples written in TypeScript. 