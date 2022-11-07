## Why WebAssembly?

Performance.

## How?

By reading a lot of documentation, then replacing the core loop of my program with an optimized loop written in C++.

```
/* BEGIN WEBASSEMBLY CODE */

let pixelBuffer = Module._malloc(
    pixels.length * Uint8Array.BYTES_PER_ELEMENT
);
Module.HEAPU8.set(pixels, pixelBuffer);
Module.ccall(
    "SwapColors",
    null,
    ["string", "array", "number", "number", "number"],
    [ColorMatchingMethod, palette, palette.length, pixelBuffer, pixels.length]
);

let convertedImage = new Uint8ClampedArray(
    Module.HEAPU8.buffer,
    pixelBuffer,
    pixels.length
);

Module._free(pixelBuffer);

/* END WEBASSEMBLY CODE */
```

The preceding code snippet is a great example of how to call an exported C++ method with a string, static array, integer, and dynamic array as parameters.

## Gotcha's

When trying to hack this together, I encountered a couple of areas of confusion: scope, synchronization, and dynamic memory.

- Scope
  - When I say scope, I'm referring to where my exported functions live and where I can call them.
  - At a minimum, you need a .wasm file to run your compiled code in the browser.
  - The easiest way to access and use this .wasm file is by importing the JavaScript glue file that's generated when compiling with [emscripten](https://emscripten.org/).
  - The glue file will give you access to the "Module" object, which you can use to call functions exported from your C/C++ code such as malloc, free, and, in my case, the SwapColors method.
- Synchronization

  - This is a small detail that I spent a lot longer on than I should have.
  - Basically, I was trying to initialize the page by making a call to an exported method, but was getting undefined reference errors: `Uncaught TypeError: Cannot read properties of undefined (reading 'malloc') webassembly`.
  - This error was occurring because the WebAssembly module hadn't fully loaded in, which confused me because it's the first script I import in "index.html."
  - To fix the error, I simply wait until the Module has fully loaded before calling any exported methods (including malloc): `Module.onRuntimeInitialized = () => initializePreviewImages();`.

- Dynamic Memory

  - Code examples helped me out tremendously with this one.
  - To call methods that require dynamically allocated memory, you must use the HEAP found on the WebAssembly Module.
  - You can write to the HEAP using the "set" method and read from it by accessing the buffer (i.e. Module.HEAP.buffer) [[1](#ref1)].

## A Note On Compilation

emscripten offers [many compiler settings](https://github.com/emscripten-core/emscripten/blob/main/src/settings.js). I would recommend sticking to what's necessary while making sure to include the optimization flag (use -O3 for the best performance). My final compiler command came out to:

```
emcc src/Main.cpp src/Color.cpp -o build/pixel-swap.js -O3 -sALLOW_MEMORY_GROWTH=1 -sEXPORTED_RUNTIME_METHODS=ccall -sEXPORTED_FUNCTIONS=_main,_SwapColors,_free
```

- At first, I was using `-sLINKABLE=1` and `-sEXPORT_ALL=1` to resolve undefined symbol errors, but this resulted in a bloated output file and Module object.
- `-sALLOW_MEMORY_GROWTH=1` was necessary to store larger images (exceeding a few megabytes) on the heap.
- I didn't include "cwrap" in `EXPORTED_RUNTIME_METHODS` because I didn't use it, but in other examples, you will see them include both.
- The .js on the end of `-o build/pixel-swap.js` tells emscripten to build only the .wasm and .js glue file. You can also build a .html file, but I didn't because I wasn't going to use it.
- `-O3` is the highest level of optimization you can specify for the compiler and I would recommend including this in your production code otherwise you aren't fully taking advantage of the power of WebAssembly.

### References

1. <a name="ref1"></a>Marco Selvatici. "Webassembly Tutorial - 10. Memory," https://marcoselvatici.github.io/WASM_tutorial/.
2. emscripten. "Interacting with code," https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html.
3. WebAssembly. "Developer's Guide," https://webassembly.org/getting-started/developers-guide/.
4. MDN Web Docs. "Compiling an Existing C Module to WebAssembly," https://developer.mozilla.org/en-US/docs/WebAssembly/existing_C_to_wasm.
