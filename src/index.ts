#!/usr/bin/env node
import yargs from 'yargs';
import defaultCommand from "./commands/default"
console.log('Version : v1.2.0')

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
  }, defaultCommand)
  .version(`0.1.0`)
  .help().argv;
