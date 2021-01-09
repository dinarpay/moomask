export function formatAmount(amount, precision) {
  return amount / Math.pow(10, precision);
}

export function precisionFormat(precision) {
  return function(amount, afterDecimal = 2) {
    if(isNaN(amount)) {
      return 0;
    }
    let amt = amount / Math.pow(10, precision);
    amt = amt.toString();
    let dotPlace = amt.indexOf('.');
    if(dotPlace !== -1) {
      let fraction = amt.substring(dotPlace + 1);
      if(fraction.length > afterDecimal) {
        fraction = fraction.substring(0, afterDecimal);
      } else if(fraction.length === 1) {
        fraction = fraction + '0';
      }
      amt = amt.substring(0, dotPlace);
      amt = amt + '.' + fraction;
    }
    return amt;
  }
}

export function formatDateFromSeconds(dt) {
  const dat = new Date(dt * 1000);
  return dat.toLocaleString();
}