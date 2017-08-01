[![Build Status](https://travis-ci.org/aikrasnov/webdriverio-command-parser.svg?branch=master)](https://travis-ci.org/aikrasnov/webdriverio-command-parser)
[![Coverage Status](https://coveralls.io/repos/github/aikrasnov/webdriverio-command-parser/badge.svg)](https://coveralls.io/github/aikrasnov/webdriverio-command-parser)

[![NPM](https://nodei.co/npm/webdriverio-command-parser.png)](https://npmjs.org/package/webdriverio-command-parser)

Webdriverio-command-parser
===================


Webdriverio-command-parser генерирует js модуль с функциями на основе [кастомных комманд](http://webdriver.io/api/utility/addCommand.html#Usage) для [webdriverio](http://webdriver.io/). 

Исходный файл
```javascript
    /**
    * Check something
    */
    browser.addCommand('myCustomCommand', async (myArg, myArgTwo) => {
       // do smth
    });
```
Результат
```javascript
const myCustomCommand => (myArg, MyArgTwo) => {};

module.exports = {
	myCustomCommand
};

```
Полученный модуль можно использовать для [автокомплита](https://blog.jetbrains.com/webstorm/2014/07/how-webstorm-works-completion-for-javascript-libraries/) в WebStorm.

----------



Установка
-------------

```javascript
npm install --save webdriverio-command-parser
```
Или для использования из командной строки (например, в кроне)
```javascript
npm install -g webdriverio-command-parser
```

Использование
-------------

Из командой строки
```bash
wparser -p /path/to/you/commands/ -o /place/for/save/parsed/commands/
```
Можно указывать путь до файла, или до папки.

Возможные аргументы
```bash
  -p, --path             path to file or directory                           
  -o, --output           path to directory or file for write parsed commands 
  -f, --refile           regexp for match files                              
  -c, --recommand        regexp for match custom command definitions         
  -d, --eslintdisable    disable eslint in output file                       
  -s, --showall          show defective commands                             
  -h, --help             show help   
```

Как подключаемую либу
```javascript
const {parsePath} = require('webdriverio-command-parser');
parsePath('/path/to/you/command').then(() => {
    console.log('done');
}).catch(err => {
    console.log(`some error here ${err}`);
});
```
