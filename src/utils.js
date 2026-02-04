console.log("utils.js loaded");

function isValidInt(valueInput) {
    const num = Number(valueInput);
    return Number.isInteger(num);
}

//console.log(isValidInt("123")); // true
//console.log(isValidInt("123.45")); // false
//console.log(isValidInt("abc")); // false

function getFormattedTimestamp(){
    const now = new Date();
    const padding = (num) => String(num).padStart(2,'0');    
    // now.getMonth() returns a num that represents the month but starts at 0 rather than 1
    const month = padding(now.getMonth()+ 1); 
    const day = padding(now.getDate());
    const year = now.getFullYear();
    const hours = padding(now.getHours());
    const minutes = padding(now.getMinutes());
    const seconds = padding(now.getSeconds());
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

console.log(getFormattedTimestamp());

module.exports = { isValidInt, getFormattedTimestamp };
console.log(module.exports);