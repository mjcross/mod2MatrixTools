# mod2MatrixTools

What is it?
-----------
An easy to use implementation of a number of modular (mod 2) matrix algebra tools.

How do I use it?
----------------
Simply download the files into a local directory and point a JavaScript-enabled browser at mod2matrixtools.html.

What Tools are Included?
------------------------
All the following, in modulo-2 algebra:
* Berlekamp-Massey algorithm (finds the simplest linear feedback shift register that will generate a given binary sequence)
* Simplify Linear System (reduces or completely solves a system of linear equations, using Gaussian elimination)
* Invert a Matrix (inverts a square matrix, using the Gauss-Jordan method)
* Multiply two matrices
* Transpose a matrix
* Flip a matrix

Any limitations?
----------------
Not that I know of. The maximum size of matrix is theoretically limited only by your browser. I've tested it up to sizes of 100 x 100.

Why did you implement it in JavaScript?
---------------------------------------
Because I wanted to host the tools on a webserver that doesn't implement PHP.

Can I contribute improvements or corrections?
---------------------------------------------
Sure. Just create a local branch and submit a pull request.
Feel free to notify me of any errors.
Requests like "please add feature 'x'" will be ignored.

How does it work?
-----------------
The matrix handling functions live in the .js file starting around line 236. 
I put some basic documentation in the code. If you need to know more than that then read up on linear algebra and field theory.
