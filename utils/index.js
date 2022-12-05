export function numberWithCommas(x) {
  return x.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function numberWithCommasToFixed(x) {
  return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}