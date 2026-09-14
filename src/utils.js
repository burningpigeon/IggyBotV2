console.log("utils.js loaded");

function isValidInt(valueInput) {
    const num = Number(valueInput);
    return Number.isInteger(num);
}

//console.log(isValidInt("123")); // true
//console.log(isValidInt("123.45")); // false
//console.log(isValidInt("abc")); // false

function getFormattedTimestamp(){
    // Use an explicit timezone instead of the host machine's local time/timezone
    // (e.g. GCP VMs default to UTC, which was causing the backend timestamp to
    // drift several hours from the intended EST time).
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).formatToParts(new Date());

    const get = (type) => parts.find(p => p.type === type).value;
    const month = get('month');
    const day = get('day');
    const year = get('year');
    const hours = get('hour') === '24' ? '00' : get('hour');
    const minutes = get('minute');
    const seconds = get('second');
    return `${Number(month)}/${Number(day)}/${year}-${hours}:${minutes}:${seconds}`;
}

// console.log(getFormattedTimestamp());

function capitalizeFirstLetters(phraseIn){
    phraseIn = phraseIn.toLowerCase()
    if (phraseIn.length === 0){
        return ''
    }
    if (typeof phraseIn !== 'string') {
        throw new TypeError('Input must be a string');
    }
    return phraseIn
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}    


module.exports = { isValidInt, getFormattedTimestamp, capitalizeFirstLetters };
