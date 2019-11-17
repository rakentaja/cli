import Mustache from "mustache"

export default (template: string): string[] => {
  return Mustache.parse(template)
    .filter((r: string) => r[0] === 'name')
    .map((r: Array<string | number>) => r[1]);
}
