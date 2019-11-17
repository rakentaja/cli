export interface ITemplateFile {
	template: string;
	path: string;
	names: string[]
}


export interface IRakentajaConfiguration {
  keys: {[key:string]:any};
  commands: string[];
  [extra: string]: any;
}
