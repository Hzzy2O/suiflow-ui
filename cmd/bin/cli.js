#!/usr/bin/env node

import { program } from 'commander';
import initCommand from '../commands/init.js';
import addCommand from '../commands/add.js';

program
  .command('init')
  .description('Initialize your project')
  .action(initCommand);

program
  .command('add [component]')
  .description('Add a component to your project')
  .action(addCommand);

program.parse(process.argv);
