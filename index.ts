#!/usr/bin/env node
import yargs from 'yargs';
import renderer from "./lib/renderer";


yargs
  .command({
    command: '* <source> [target]',
    describe: 'Create a project from template',
    handler: ({source,target}: {source :string, target:string, [key: string]: any}) => {
      renderer(source, target);
    },
  })
  .help().argv;


