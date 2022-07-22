export function stringifyColorSearchParam(color: string) {
  return color.toLowerCase().replace(/^#/, '')
}
