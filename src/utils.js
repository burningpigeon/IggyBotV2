console.log("utils.js loaded");

function isValidInt(valueInput) {
    const num = Number(valueInput);
    return Number.isInteger(num);
}

//console.log(isValidInt("123")); // true
//console.log(isValidInt("123.45")); // false
//console.log(isValidInt("abc")); // false

module.exports = { isValidInt };