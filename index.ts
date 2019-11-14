#!/usr/bin/env node
import yargs from 'yargs';
import renderer from "./lib/renderer";


yargs
  .command({
    command: '* [directory]',
    describe: 'Create a project from template',
    handler: ({directory}: {directory: string; [key: string]: any}) => {
      renderer(directory);
    },
  })
  .help().argv;


