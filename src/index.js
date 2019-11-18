#!/usr/bin/env node
import yargs from 'yargs';
import renderer from './lib/renderer';

yargs
  .command('* <source> [target]', 'Create a project from template', yargs => {
    yargs.positional('source', {
      describe: 'Source directory or a git URL. If that is a valid git URL, rakentaja will attempt to clone the repository. \n NOTE: Git support will arive in next major version!',
      type: 'string'
    })
      .positional('target', {
        describe: 'Target directory to generate project',
        type: 'string',
        default: './'
      })
  },
  /**
   * @param {{source:string,target:string}} userinput
   * @returns {any}
   */
    ({ source, target }) => renderer(source, target))
  .version(`0.1.0`)
  .help().argv;
