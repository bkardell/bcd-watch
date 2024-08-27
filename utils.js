function dateFromISODateString(str) {
	return new Date(str.replaceAll("-", "/"))
}

function toISODateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function toShortDateString(date) {
  let dateParts = date.toDateString().split(' ')
  dateParts.shift()
  return dateParts.join('-')
}

function stripFileExtension(str) {
  return str.split(".")[0]
}

function shortDate(date) {
  let dateParts = date.toDateString().split(' ')
  dateParts.shift()
  return dateParts.join('-')
}

function jsonForDate(date) {
	return toISODateString(date) + ".json"
}

/**
 * @date The date to begin searching for Monday from.
 * 
 * @forward boolean which determines whether if the date is Monday it 
 *          returns that day, or the following Monday
 */
function findNextMonday(date, forward=false) {
    const result = new Date(date);
    const day = result.getDay();
    if (day==1) {
    	let plus = 0;
    	if (forward !== false) {
    	  plus = 7;
    	}
    	result.setDate(result.getDate() + plus);
    	return result
    }
    const diff = (day === 0 ? 1 : 8 - day); // If it's Sunday (day 0), add 1 day. Otherwise, add the difference to Monday.
    result.setDate(result.getDate() + diff);
    return result;
}

/**
 * @date The date to begin searching for Monday from.
 */
function findPreviousMonday(date) {
    const result = new Date(date);
    const day = result.getDay();
    const diff = (day === 0 ? 1 : 8 - day); // If it's Sunday (day 0), add 1 day. Otherwise, add the difference to Monday.
    result.setDate(result.getDate() - diff);
    return result;
}

function areSameDate(date1, date2) {
 return  date1.toDateString() == date2.toDateString();
}


exports.toISODateString = toISODateString
exports.toShortDateString = toShortDateString
exports.stripFileExtension = stripFileExtension
exports.jsonForDate = jsonForDate
exports.findNextMonday = findNextMonday
exports.dateFromISODateString = dateFromISODateString
exports.areSameDate = areSameDate
exports.findPreviousMonday = findPreviousMonday
