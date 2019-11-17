#!/usr/bin/env node
import yargs from 'yargs';
import renderer from './lib/renderer';


yargs
  .command('* <source> [target]', 'Create a project from template', yargs => {
    yargs.positional('source', {
      describe: 'Source directory or a git URL. If that is a valid git URL, rakentaja will attempt to clone the repository.',
      type: 'string'
    })
    .positional('target', {
      describe: 'Target directory to generate project',
      type: 'string',
      default: './'
    })
  }, ({source,target}: any) => renderer(source, target))
  .help().argv;
