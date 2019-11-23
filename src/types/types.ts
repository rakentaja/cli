export interface IRakentajaConfiguration {
  keys: {[key:string]:any};
  commands: string[];
  [extra: string]: any;
  ignore: string[]
}
