export function isValidPage(page: string) {
  const numb = Number(page)
  return !isNaN(numb) && numb > 0
}

export function isValidLimit(limit: string) {
  const numb = Number(limit)
  return !isNaN(numb) && numb > 0 && numb < 5;
}