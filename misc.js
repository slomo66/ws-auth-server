const numberToFormattedString = (value = 0, min = 0, fill = "") => {
  const sValue = value.toString();

  if (sValue.length >= min) return sValue;

  const chars = fill.repeat(min - sValue.length);
  const result = chars.concat(sValue);

  return result;
};

const getDateAsString = (mode = 0, timestamp = 0) => {
  const date = new Date(timestamp);
  const year = date.getFullYear().toString();
  const month = numberToFormattedString(1 + date.getMonth(), 2, "0");
  const day = numberToFormattedString(date.getDate(), 2, "0");
  // prettier-ignore
  switch (mode) {
      case 0:  return year + month + day;
      case 1:  return numberToFormattedString(date.getHours(), 2, '0') +
                      ':' +
                      numberToFormattedString(date.getMinutes(), 2, '0') +
                      ':' +
                      numberToFormattedString(date.getSeconds(), 2, '0');
      case 2:  return year + '/' + month + '/' + day + ' - ' +  
                      numberToFormattedString(date.getHours(), 2, '0') +
                      ':' +
                      numberToFormattedString(date.getMinutes(), 2, '0') +
                      ':' +
                      numberToFormattedString(date.getSeconds(), 2, '0');
      case 3:  return year + '/' + month + '/' + day;
      case 4:  return '"' +
                      month + 
                      '/' + 
                      day + 
                      '/' + 
                      year.slice(2, 4) + ' ' + 
                      numberToFormattedString(date.getHours(), 2, '0') + 
                      ':' +
                      numberToFormattedString(date.getMinutes(), 2, '0') +
                      ':' +
                      numberToFormattedString(date.getSeconds(), 2, '0') + 
                      '"';
   
      default: return '';
    }
};

const getTimeAsString = (mode = 0, timestamp = 0) => {
  const date = new Date(timestamp);

  // prettier-ignore
  switch (mode) {
    case 0:  return +
                numberToFormattedString(date.getHours(), 2, '0') + 
                ':' +
                numberToFormattedString(date.getMinutes(), 2, '0') +
                ':' +
                numberToFormattedString(date.getSeconds(), 2, '0');

    default: return '';
  }
};

module.exports = { numberToFormattedString, getDateAsString, getTimeAsString };
