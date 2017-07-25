#! /usr/bin/env node

const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const {parsePath} = require('./index');

/* eslint-disable sort-keys */
const SECTIONS = [{
    header: 'Webdriverio custom command parser',
    content: 'Generates a file with the signatures of custom commands'
},
{
    header: 'options',
    optionList: [
        {
            alias: 'p',
            name: 'path',
            description: 'path to file or directory'
        },
        {
            alias: 'o',
            name: 'output',
            description: 'filename for write parsed commands'
        },
        {
            alias: 'f',
            name: 'refile',
            description: 'regexp for match files'
        },
        {
            alias: 'c',
            name: 'recommand',
            description: 'regexp for match custom command definitions'
        },
        {
            alias: 'd',
            name: 'eslintdisable',
            description: 'disable eslint in output file'
        },
        {
            alias: 's',
            name: 'showall',
            description: 'show defective commands '
        },
        {
            alias: 'h',
            name: 'help',
            description: 'show help'
        }
    ]
}];

const OPTIONS_DEFINITIONS = [
    {alias: 'p', name: 'path', type: String},
    {alias: 'o', name: 'output', type: String},
    {alias: 'f', name: 'refile', type: RegExp},
    {alias: 'c', name: 'recommand', type: RegExp},
    {alias: 'd', name: 'eslintdisable', type: Boolean},
    {alias: 's', name: 'showall', type: Boolean},
    {alias: 'h', name: 'help', type: Boolean}
];
/* eslint-enable */

const OPTIONS = commandLineArgs(OPTIONS_DEFINITIONS);
const {path, output, refile, recommand, eslintdisable, showall, help} = OPTIONS;

if (help !== undefined) {
    const usage = getUsage(SECTIONS);
    console.log(usage);
    process.exit(0);
}
// (path, fileName = 'autocomplete.js', reFile = /.*\.js$/, reCommand = /.addCommand.*\s=>\s{/, eslintDisable = true, showAll = true
if (path === undefined) {
    console.log('path required!');
    process.exit(1);
} else {
    parsePath(path, output, refile, recommand, eslintdisable, showall).then(() => {
        console.log('done');
        process.exit(0);
    }).catch(err => {
        console.log(err);
        process.exit(1);
    });
}
