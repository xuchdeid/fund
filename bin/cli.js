#!/usr/bin/env node

const optionator = require('optionator');
const fund = require('../lib');

'use strict';

let option = optionator({
    prepend: 'fund 001549 000961',
    defaults: {
        concatRepeatedArrays: true,
        mergeRepeatedObjects: true
    },
    options: [
        {
            option: 'delay',
            type: 'Int',
            default: '60',
            description: 'delay {seconds} to refresh data'
        },
        {
            option: 'version',
            alias: 'v',
            type: 'Boolean',
            description: 'Output the version number'
        },
        {
            option: 'help',
            alias: 'h',
            type: 'Boolean',
            description: 'Show help'
        }
    ]
});

let currentOptions = option.parse(process.argv);
const fundCodes = currentOptions._;

if (currentOptions.version) {
    console.log(`v${require('../package.json').version}`);
} else if (currentOptions.help) {
    console.log(option.generateHelp());
} else if (fundCodes.length > 0) {
    fund.run(fundCodes, currentOptions.delay * 1000);
} else {
    console.log(option.generateHelp());
}

