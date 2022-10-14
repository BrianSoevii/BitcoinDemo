function formatNumber(num: number | string) {
  const aux = Number(num);
  return aux
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export default formatNumber;
