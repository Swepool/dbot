export function numberWithCommas(input: number, decimals: number = 0) {
  return input.toFixed(decimals).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}