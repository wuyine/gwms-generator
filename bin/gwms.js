#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');


program
  .version(require('../package').version,'-v, --version')
  .usage('<command> [options]')

program
  .command('module <moduleName>')
  .description('add a new module')
  .option('-d, --cwd <dir>','Set execution directory')
  .action((name,cmd)=> {
    const options = {
      cwd: cmd.cwd
    }
    require('../lib/addModule')(name,options)
  })



program.parse(process.argv)




