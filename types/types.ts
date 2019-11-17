export interface ITemplateFile {
	template: string;
	sourcePath: string;
	targetPath: string;
	keys: string[]
}


export interface IRakentajaConfiguration {
  keys: {[key:string]:any};
  commands: string[];
  [extra: string]: any;
  ignore: string[]
}
