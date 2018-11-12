#!/usr/bin/env node

const program = require("commander");
const init = require("../lib/init");
const install = require("../lib/install");
const config = require("../lib/config");
const { prompt } = require('inquirer');

const questions = [{
        type: 'input',
        name: 'store_version',
        message: 'Enter Opencart Store Version (ex. 3.0.2.0) ...'
    },
    {
        type: 'input',
        name: 'codename',
        message: 'Enter codename of your project/extension (ex. myextension) ...'
    },
    {
        type: 'input',
        name: 'name',
        message: 'Enter name of your project/extension (ex. My Extension) ...'
    },
    {
        type: 'input',
        name: 'version',
        message: 'Enter version of your project/extension (ex. 1.0.0) ...'
    }
];

program
    .version(config.version)
    .description('Contact management system');

program
    .command('init')
    .description('Initialize Shopunity for current folder')
    .action(async() => {
        prompt(questions).then(answers =>
            init(answers));
    });

program
    .command('install <codename>')
    .alias('i')
    .description('Install extension by codename')
    .action(function(codename) {
        install(codename);
    });


// allow commander to parse `process.argv`
program.parse(process.argv);