import {ITemplateFile} from '../types/types';
import Mustache from 'mustache';
import fs from 'fs';
import inquirer from 'inquirer';
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
const getAllNamesInTemplates = async (dir: string): Promise<Array<string>> => {
  const templateFilePaths = await getFilePaths(dir);
  let names: Array<string> = [];
  // Get contents for all template files in glob
  templateFilePaths
    .map(filePath => {
      return {
        template: fs.readFileSync(filePath, {encoding: 'utf8'}),
        path: filePath,
      };
    })
    .forEach((templateFile: ITemplateFile) => {
      // Read file contents
      const namesInTemplate: Array<string> = Mustache.parse(
        templateFile.template,
      )
        .filter((r: string) => r[0] === 'name')
        .map((r: Array<string | number>) => r[1]);
      names = [...names, ...namesInTemplate];
      // const arrays = new Set(Mustache.parse(template).filter((r:string) => r[0] === "#").map((r:Array<string | number>) => r[1]))
    });
  return names;
};

// directory is current directory by default
const renderer = async (source: string = './', target = './') => {
  const names = await getAllNamesInTemplates(source);
  // Start asking questions
  const prompts = [...new Set(names)].map((name: string | unknown) => ({
    type: 'input',
    name,
    message: `Please enter ${name}`,
    default: `${name}`,
  }));
  inquirer.prompt(prompts).then((answers: any) => {
    console.dir(answers);
  });
};

export default renderer;
