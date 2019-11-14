#!/usr/bin/env node
import path from 'path';
import glob from 'glob';
import fs from 'fs-extra';
import yargs from 'yargs';
import Mustache from 'mustache';

import inquirer from 'inquirer';

// directory is current directory by default
const getParametersInTemplates = (dir: string = './') => {
  // Get all files under globPath
  const globPath = path.resolve(dir, '**');
  glob(
    globPath,
    {
      dot: true,
      ignore: ['**/node_modules/**', '**/.git/**'],
      nodir: true,
    },
    function(er, templateFiles) {
      console.log('Got template files', templateFiles);
      // Get contents for all template files in glob
      const templates = templateFiles.map(filePath =>
        fs.readFileSync(filePath, {encoding: 'utf8'}),
      );

      let names: Array<string> = [];

      templates.forEach((template: string) => {
        // Read file contents
        const namesInTemplate: Array<string> = Mustache.parse(template)
          .filter((r: string) => r[0] === 'name')
          .map((r: Array<string | number>) => r[1]);

        names = [...names, ...namesInTemplate];
        // const arrays = new Set(Mustache.parse(template).filter((r:string) => r[0] === "#").map((r:Array<string | number>) => r[1]))
      });

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
    },
  );
};

yargs
  .command({
    command: '* [directory]',
    describe: 'Create a project from template',
    handler: ({directory}: {directory: string; [key: string]: any}) => {
      console.log(`Command Arguments`, directory);
      getParametersInTemplates(directory);
    },
  })
  .help().argv;

//inquirer.prompt([{}]).then((answers: any[] | unknown) => {
//  // Use user feedback for... whatever!!
//});
