// import {ITemplateFile} from '../types/types';
import Mustache from 'mustache';
import fs from 'fs';
// import inquirer from 'inquirer';
import glob from 'glob';
import path from 'path';

const globOptions = {
  dot: true,
  ignore: ['**/node_modules/**', '**/.git/**'],
  nodir: true,
};

const getFilePaths = (dir: string): Promise<Array<string>> => {
  // Get all files under globPath
  const globPath = path.resolve(dir, '**');
  return new Promise((resolve, reject) => {
    glob(globPath, globOptions, function(
      err: any,
      templateFilePaths: Array<string>,
    ) {
      return err ? reject(err) : resolve(templateFilePaths);
    });
  });
};
const getFiles = (filePaths: Array<string>) => {
  return filePaths.map(filePath => {
    const template = fs.readFileSync(filePath, {encoding: 'utf8'});

    return {
      template,
      path: filePath,
      names: getNames(template),
    };
  });
};
const getNames = (template: string): Promise<Array<string>> => {
  return Mustache.parse(template)
    .filter((r: string) => r[0] === 'name')
    .map((r: Array<string | number>) => r[1]);
};

// directory is current directory by default
const renderer = async (source: string = './', target = './') => {
  const filePaths = await getFilePaths(source);
  const files = getFiles(filePaths);
	console.dir(files)
  
	// Start asking questions
  /**
	const prompts = [...new Set(names)].map((name: string | unknown) => ({
    type: 'input',
    name,
    message: `Please enter ${name}`,
    default: `${name}`,
  }));
  inquirer.prompt(prompts).then((answers: any) => {
    console.dir(answers);
  });
	*/
};

export default renderer;
