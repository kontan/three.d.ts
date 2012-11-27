three.d.ts
====
#### TypeScript interface for three.js ####

three.d.ts provides a type-safe and readable interface for three.js.   
This porject is based on [three.js](http://mrdoob.github.com/three.js/) r53.

Most definition of the classes were completed. It needs checking, brushing up and testing.

### Usage (for beginners of TypeScript)

1. Download three.js ([three.js r53](https://github.com/mrdoob/three.js/archive/r53.zip) is recommended) and unzip it.
2. Download [three.d.ts](https://github.com/kontan/three.d.ts/raw/master/three.d.ts) and place it at any directory.
3. Create your TypeScript source file. 
4. Write the following special comment at the top of the your source file:

     &lt;reference path="relative/path/to/three.d.ts" /&gt;

 The compiler will search type names and identifiers from the file. 
 Even if you write a wrong path to the TypeScript ambient source file, the compiler will not complain about missing the file :-( 
 The compiler will just says "The name 'THREE' does not exists in the current scope." 
 Be careful about the path.


5. Write your application. If you want to refer a API reference, watch [official API reference](http://mrdoob.github.com/three.js/docs/53/) (a little out of date) or read three.d.ts. 
5. Launch shell and compile the your code.
6. Create your html file to invoke the generated JavaScript source code. Dont't forget to refer both of three.js and yourcode.js from your html source file. The previous special comment line does not influence the generated JavaScript. 
6. Open the html file. If your application doesn't work, [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) is useful to debug.  

Enjoy three.js!

### Demo

[http://kontan.github.com/three.d.ts](http://kontan.github.com/three.d.ts)

### TODO

*  Currently, a automatically-generated reference is not provided because there is no document generator for TypeScript. If it is released, I intend to provide a API reference generated from three.d.ts. It would be very helpful for not only TypeScript users but also JavaScript users.

* Prividing a lot of examples written in TypeScript. 