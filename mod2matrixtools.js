// copyleft mjcross 2018 - all wrongs reserved
// 

//====================================
// Functions for manipulating the DOM
//====================================
function hideClass(className) {
    setDisplayForClass(className, "none");
}

function showClass(className) {
    setDisplayForClass(className, "block");
}

function setDisplayForClass(className, displayProperty) {
    var classElements = document.getElementsByClassName(className);
    for (var i = 0; i < classElements.length; i ++) {
        classElement = classElements[i];
        classElement.style.display = displayProperty;
    }
}

function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function clearAllInputs() {
    var inputElements = document.getElementsByTagName("Input");
    for (var i = 0; i < inputElements.length; i ++) {
        inputElement = inputElements[i];
        inputElement.value = "";
    }
}

//==========================================
// Functions to create and display a matrix
//==========================================
function stringToArray(userText) {
    var nChars = userText.length;
    var array = [];
    var nRows = 0;
    var nCols = 0;
    var row = [];
    var errorMsg = "";
    var validRow = false;
    
    for (var charNum = 0; charNum < nChars; charNum ++) {
        var thisChar = userText[charNum];
        
        if (thisChar == "0") {
            row.push(0);
            validRow = true;
        }
        if (thisChar == "1") {
            row.push(1);
            validRow = true;
        }
        if (thisChar == ";" || charNum == (nChars - 1)) {
            if (nRows == 0) {
                nCols = row.length;
            }
            
            if (validRow == true) {
                array.push(row);
                nRows ++;
                row = [];
                validRow = false;
            }
        }
    }
    
    if (nRows > 0) {
        // check all rows have the same number of columns
        for (var rowNum = 0; rowNum < nRows; rowNum ++) {
            if (array[rowNum].length != nCols) {
                errorMsg = "Error: all rows must have the same number of columns.";
                break;
            }
        }
    } else {
        errorMsg = "Error: empty matrix."
    }
    
    return {
        array: array,
        errorMsg: errorMsg
    }
}

function displayArray(array, element) {
    var nRows = array.length;
    var rowNum;
    var codeElement = document.createElement("CODE");
    var node;
    
    for (rowNum = 0; rowNum < nRows; rowNum ++) {
        node = document.createTextNode(array[rowNum] + ';');
        codeElement.appendChild(node);
        codeElement.appendChild(document.createElement("BR"));
    }
    
    element.appendChild(codeElement);
}

function clearOutput() {
    document.getElementById("output-area").style.display = "none";
    removeChildren(document.getElementById("matrix-result-area"));
}

//====================================
// Functions linked to action buttons
//====================================
function selectTool(className) {
    clearAllInputs();
    clearOutput();
    hideClass(selectTool.lastShown);
    showClass(className);
    selectTool.lastShown = className;
}

function resetButton() {
    clearOutput();
    clearAllInputs();
}

function bkmButton() {
    var parseResult = stringToArray(document.getElementById("text-input").value);
    
    if (parseResult.errorMsg != "") {
        alert(parseResult.errorMsg);
        return;
    }
    
    var bkmResult = bkm(parseResult.array);
    if (bkmResult.errorMsg != "") {
        alert(bkmResult.errorMsg);
        return;
    }
    
    clearOutput();
    displayArray(bkmResult.array, document.getElementById("matrix-result-area"));
    document.getElementById("output-area").style.display = "block";
}

function invertButton() {
    var parseResult = stringToArray(document.getElementById("text-input").value);
    
    if (parseResult.errorMsg != "") {
        alert(parseResult.errorMsg);
        return;
    }
    
    var inverseResult = invert(parseResult.array);
    if (inverseResult.errorMsg != "") {
        alert(inverseResult.errorMsg);
        return;
    }
    
    clearOutput();
    displayArray(inverseResult.array, document.getElementById("matrix-result-area"));
    document.getElementById("output-area").style.display = "block";
}

function reduceButton() {
    var parseResult = stringToArray(document.getElementById("text-input").value);
    
    if (parseResult.errorMsg != "") {
        alert(parseResult.errorMsg);
        return;
    }
    
    var reduceResult = reduce(parseResult.array);
    if (reduceResult.errorMsg != "") {
        alert(reduceResult.errorMsg);
        return;
    }
    
    clearOutput();
    displayArray(reduceResult.array, document.getElementById("matrix-result-area"));
    document.getElementById("output-area").style.display = "block";
}

function multiplyButton() {
    var parseResultA = stringToArray(document.getElementById("text-input-a").value);
    if (parseResultA.errorMsg != "") {
        alert("Matrix A " + parseResultA.errorMsg);
        return;
    }

    var parseResultB = stringToArray(document.getElementById("text-input-b").value);
    if (parseResultB.errorMsg != "") {
        alert("Matrix B " + parseResultB.errorMsg);
        return;
    }

    var multiplyResult = multiply(parseResultA.array, parseResultB.array);
    if (multiplyResult.errorMsg != "") {
        alert(multiplyResult.errorMsg);
        return;
    }

    clearOutput();
    displayArray(multiplyResult.array, document.getElementById("matrix-result-area"));
    document.getElementById("output-area").style.display = "block";
}

function transposeButton() {
    var parseResult = stringToArray(document.getElementById("text-input").value);
    if (parseResult.errorMsg != "") {
        alert(parseResult.errorMsg);
        return;
    }

    clearOutput();
    transposeResult = transpose(parseResult.array);
    displayArray(transposeResult.array, document.getElementById("matrix-result-area"));
    document.getElementById("output-area").style.display = "block";
}

function flipButton() {
    var parseResult = stringToArray(document.getElementById("text-input").value);
    if (parseResult.errorMsg != "") {
        alert(parseResult.errorMsg);
        return;
    }

    clearOutput();
    flipResult = flip(parseResult.array);
    displayArray(flipResult.array, document.getElementById("matrix-result-area"));
    document.getElementById("output-area").style.display = "block";
}


//==================================
// functions to manipulate matrices
//==================================
function bkm(array) {
    var nRows = array.length;
    var nCols = array[0].length;
    var errorMsg = "";
    
    if (nRows != 1) {
        return {
            array: [],
            errorMsg: "Error: please provide a single row input."
        }
    }
    
    sequence = array[0];
    nBits = sequence.length;
    
    // declare and initialise variables
    var b = [];
    var coeff = [];
    var t = [];
    for (var i = 0; i < nBits; i++) {
        b.push(0);
        coeff.push(0);
        t.push(0);
    }
    b[0] = 1;
    coeff[0] = 1;
    var N = 0;
    var length = 0;
    var m = -1;
    var d;
    var i;
    
    // execute the algorithm
    while (N < nBits) {
        d = sequence[N];
        
        for (i = 1; i <= length; i ++) {
            d ^= coeff[i] & sequence[N - i];
        }
        
        if (d == 1) {
            // copy coefficient array into t[]
            for (i = 0; i < nBits; i ++) {
                t[i] = coeff[i];
            }
            
            for (i = 0; (i + N - m) < nBits; i ++) {
                coeff[i + N - m] ^= b[i];
            }
            
            if (length <= (N >> 1)) {
                length = N + 1 - length;
                m = N;
                
                // copy t[] to b[]
                for (i = 0; i < nBits; i ++) {
                    b[i] = t[i];
                }
            }
        }
        
        N ++;
    }
    
    var generatorPolyStr = "generator polynomial g(x) = ";
    var firstCoeff = true;
    for (i = 0; i <= length; i ++) {
        if (coeff[i]) {
            if (firstCoeff) {
                firstCoeff = false;
            } else {
                generatorPolyStr += " + ";
            }
            if (i == 0) {
                generatorPolyStr += "1";
            } else {
                generatorPolyStr += "x^" + i;
            }
        }
    }
    
    var regStr = length + " bit resister tapped at positions ";
    var firstTap = true;
    for (i = 1; i <= length; i ++) {
        if (coeff[i]) {
            if (firstTap) {
                firstTap = false;
            } else {
                regStr += ", ";
            }
            regStr += i;
        }
    }
    
    var tapCoeffStr = "tap coefficients: ";
    for (i = 1; i <= length; i ++) {
        if (i > 1) {
            tapCoeffStr += ", ";
        }
        tapCoeffStr += coeff[i];
    }
    
    var recurrenceStr = "recurrence relation: k[t+1] = ";
    var firstRel = true;
    for (i = 1; i <= length; i ++) {
        if (coeff[i]) {
            if (firstRel) {
                firstRel = false;
            } else {
                recurrenceStr += " + ";
            }
            recurrenceStr += "k[t-" + i + "]";
        }
    }
    
    return {
    array: [generatorPolyStr, regStr, tapCoeffStr, recurrenceStr],
        errorMsg: errorMsg
    }
}

function invert(array) {
    var nRows = array.length;
    var nCols = array[0].length;
    var errorMsg = "";
    
    if (nCols != nRows) {
        return {
            array: [],
            errorMsg: "Error: number of rows and columns must be the same."
        }
    }
    
    // initialise inverse matrix to identity
    var inverse = [];
    for (var rowNum = 0; rowNum < nRows; rowNum ++) {
        var row = [];
        for (var colNum = 0; colNum < nCols; colNum ++) {
            if (colNum == rowNum) {
                row.push(1);
            } else {
                row.push(0);
            }
        }
        inverse.push(row);
    }
    
    // use each row in turn as a pivot
    for (var pivotRow = 0; pivotRow < nRows; pivotRow ++) {
        
        // within thw pivot row, look for the first non-zero column
        var pivotCol = 0;
        while (array[pivotRow][pivotCol] == 0 && pivotCol < nCols) {
            pivotCol ++;
        }
        
        // if a non-zero column was found
        if (array[pivotRow][pivotCol] == 1) {
            
            // use the pivot row to eliminate every other row with a '1' in that column
            for (rowNum = 0; rowNum < nRows; rowNum += 1) {
                
                // if the row is not the pivot row and has a '1' in the pivot column
                if (rowNum != pivotRow && array[rowNum][pivotCol] == 1) {
                    
                    // XOR the coefficients of the row with the coefficients of the pivot row
                    // (NB: we know that all columns in the pivot row before 'pivotCol' are zero)
                    for (colNum = pivotCol; colNum < nCols; colNum += 1) {
                        array[rowNum][colNum] = array[rowNum][colNum] ^ array[pivotRow][colNum];
                    }
                    
                    // replicate the row operation on the inverse matrix
                    for (colNum = 0; colNum < nCols; colNum += 1) {
                        inverse[rowNum][colNum] = inverse[rowNum][colNum] ^ inverse[pivotRow][colNum];
                    }
                }
                
            }
        } else {
            // couldn't find a pivot
            errorMsg = "Unfortunately that is not an invertable matrix."
            break;
        }
        
    } // next row
    
    if (errorMsg == "") {
        // sort the rows into diagonal order as far as possible
        for (var rowA = 0; rowA < nRows - 1; rowA ++) {
            for (var rowB = rowA + 1; rowB < nRows; rowB ++) {
                if (array[rowB][rowA] == 1) {
                    
                    // swap the rows in the input matrix
                    row = array[rowA];
                    array[rowA] = array[rowB];
                    array[rowB] = row;
                    
                    // replicate the row operation on the inverse matrix
                    row = inverse[rowA];
                    inverse[rowA] = inverse[rowB];
                    inverse[rowB] = row;
                }
            }
        }
    }
    
    return {
        array: inverse,
        errorMsg: errorMsg
    }
}

function reduce(array) {
    var nRows = array.length;
    var nCols = array[0].length;
    var errorMsg = "";
         
    // use each row in turn as a pivot
    for (var pivotRow = 0; pivotRow < nRows; pivotRow ++) {
        
        // within thw pivot row, look for the first non-zero column
        var pivotCol = 0;
        while (array[pivotRow][pivotCol] == 0 && pivotCol < nCols) {
            pivotCol ++;
        }
        
        // if a non-zero column was found
        if (array[pivotRow][pivotCol] == 1) {
            
            // use the pivot row to eliminate every other row with a '1' in that column
            for (var rowNum = 0; rowNum < nRows; rowNum += 1) {
                
                // if the row is not the pivot row and has a '1' in the pivot column
                if (rowNum != pivotRow && array[rowNum][pivotCol] == 1) {
                    
                    // XOR the coefficients of the row with the coefficients of the pivot row
                    // (NB: we know that all columns in the pivot row before 'pivotCol' are zero)
                    for (var colNum = pivotCol; colNum < nCols; colNum += 1) {
                        array[rowNum][colNum] = array[rowNum][colNum] ^ array[pivotRow][colNum];
                    }
                }
            }
        }

    } // next row

    if (errorMsg == "") {
        // sort the rows into diagonal order as far as possible
        for (var rowA = 0; rowA < nRows - 1; rowA ++) {
            for (var rowB = rowA + 1; rowB < nRows; rowB ++) {
                if (array[rowB][rowA] == 1) {
                    
                    // swap the rows in the input matrix
                    var row = array[rowA];
                    array[rowA] = array[rowB];
                    array[rowB] = row;
                }
            }
        }
    }
    
    return {
        array: array,
        errorMsg: errorMsg
    }
}

function multiply(matrixA, matrixB) {
    var nRowsA = matrixA.length;
    var nColsA = matrixA[0].length;
    var nRowsB = matrixB.length;
    var nColsB = matrixB[0].length;

    if (nColsA != nRowsB) {
        return {
            array: [],
            errorMsg: "Error: number of columns in A must equal number of rows in B."
        }
    }

    var result = [];
    for (var rowNum = 0; rowNum < nRowsA; rowNum ++) {
        var row = [];
        for (var colNum = 0; colNum < nColsB; colNum ++) {
            var total = 0;
            for (var inner = 0; inner < nColsA; inner ++) {
                total = total ^ (matrixA[rowNum][inner] & matrixB[inner][colNum]);
            }
            row.push(total);
        }
        result.push(row);
    }

    return {
        array: result,
        errorMsg: ""
    }
}

function transpose(matrix) {
    var nRows = matrix.length;
    var nCols = matrix[0].length;

    var result = [];
    for (var colNum = 0; colNum < nCols; colNum ++) {
        var row = [];
        for (var rowNum = 0; rowNum < nRows; rowNum ++) {
            row.push(matrix[rowNum][colNum]);
        }
        result.push(row);
    }

    return {
        array: result
    }
}

function flip(matrix) {
    var nRows = matrix.length;
    var nCols = matrix[0].length;

    var result = [];
    for (var rowNum = nRows - 1; rowNum >= 0; rowNum --) {
        var row = [];
        for (var colNum = nCols - 1; colNum >= 0; colNum --) {
            row.push(matrix[rowNum][colNum]);
        }
        result.push(row);
    }

    return {
        array: result
    }
}

