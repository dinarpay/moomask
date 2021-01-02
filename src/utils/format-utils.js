export function formatAmount(amount, precision) {
  return amount / Math.pow(10, precision);
}

export function precisionFormat(precision) {
  return function(amount) {
    return amount / Math.pow(10, precision);
  }
}

export function formatDateFromSeconds(dt) {
  const dat = new Date(dt * 1000);
  return dat.toLocaleString();
}