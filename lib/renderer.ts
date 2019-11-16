import {ITemplateFile} from '../types/types';
import Mustache from 'mustache';
import fs from 'fs-extra';
import shell from 'shelljs';
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

const getFiles = (filePaths: Array<string>): Promise<ITemplateFile[]> => {
  const promises = filePaths.map<Promise<ITemplateFile>>(
    filePath =>
      new Promise((resolve, reject) => fs.readFile(filePath, 'utf8', (err, template) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({
            template,
            path: filePath,
            names: getNames(template),
          });
        })
			)
  );
  return Promise.all(promises);
};

const getNames = (template: string): string[] => {
  return Mustache.parse(template)
    .filter((r: string) => r[0] === 'name')
    .map((r: Array<string | number>) => r[1]);
};

const collectValues = (names: string[]) => {
  // Start asking questions
  const prompts = [...new Set(names)].map((name: string | unknown) => ({
    type: 'input',
    name,
    message: `Please enter ${name}`,
    default: `${name}`,
  }));
  return new Promise(resolve => {
    inquirer.prompt(prompts).then((answers: any) => {
      resolve(answers);
    });
  });
};
const renderFiles = (files: ITemplateFile[], values: object) => {
  files.forEach((file: ITemplateFile) => {
    const rendered = Mustache.render(file.template, values);
    fs.outputFile(file.path, rendered);
  });
};
// directory is current directory by default
const renderer = async (source: string = './', target = './') => {
  // First copy templates
  shell.cp('-R', source, target);
  const filePaths = await getFilePaths(target);
  const files = await getFiles(filePaths);
  const allKeys = files
    .map((file: ITemplateFile) => file.names)
    .reduce((acc, names) => [...acc, ...names], []);

  const values = await collectValues(allKeys);
  // Render files in target folder
  // @ts-ignore
  renderFiles(files, values);
};

export default renderer;
