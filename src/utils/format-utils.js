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
  if(typeof dt === 'string') {
    dt = parseInt(dt)
  }
  const dat = new Date(dt * 1000);
  return dat.toUTCString();
}

export function compressAddress(address, toLength = 14) {
  let len = address ? address.length : 0;
  if(len > toLength) {
    const mid = Math.floor(toLength / 2);
    let first = address.substring(0, mid);
    let last = address.substring(len - mid);
    return first + '...' + last;
  }
  return address;
}