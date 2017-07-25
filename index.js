const fs = require('fs');

const isDirectory = path => {
    if (typeof path !== 'string' || path.length <= 0) {
        throw new Error(`${path} is not string, or it empty`);
    }
    return (/[/\\]$/).test(path);
};

const writeToFile = (cmds, fileName, eslintDisable) => {
    return new Promise((resolve, reject) => {

        // if directory use default filename
        if (isDirectory(fileName)) {
            fileName = `${fileName}/autocomplete.js`;
        }
        const file = fs.createWriteStream(fileName);
        file.on('error', err => {
            reject(err);
        });

        if (eslintDisable) {
            file.write('/*eslint-disable */\n');
        }

        const write = cmd => {
            return new Promise(resolveWrite => {
                file.write(`${cmd}\n`);
                resolveWrite(0);
            });
        };

        Promise.all(cmds.map(arrayCmd => {
            return arrayCmd.map(cmd => {
                return write(cmd);
            });
        })).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
    });
};

const parseCmds = (cmds, showAll) => {
    const reName = /['"`][a-zA-Z0-9]*\b/;
    const reArgs = /(\(.*\)|[a-zA-Z]{1,999})/;
    const functions = [];

    cmds.forEach(cmd => {
        const functName = cmd.match(reName);
        cmd = cmd.replace(/(.addCommand.['"`][a-zA-Z0-9]*|\sasync\s|\s|\r\n)/g, '');
        const functArgs = cmd.match(reArgs);
        if (functName && functArgs) {
            functions.push(`export const ${functName[0].replace(/['"`]/g, '')} = ${functArgs[0]} => {};`);
        } else if (showAll) {
            console.log('not match: ', cmd);
        }
    });

    return functions;
};

const parseFile = (path, re, showAll) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            }

            if (data) {
                const cmnds = data.toString().match(new RegExp(re, 'g'));
                if (cmnds) {
                    resolve(parseCmds(cmnds, showAll));
                }
            }
            resolve([]);
        });
    });
};

const parseDirectory = (path, reFile, reCommand, showAll) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, dirContent) => {
            if (err) {
                reject(new Error(`cannot read contents of a directory ${err}`));
            }

            // if dir empty
            if (!dirContent) {
                dirContent = [];
            }

            dirContent = dirContent.filter(file => {
                return file.match(reFile);
            });

            Promise.all(dirContent.map(file => {
                return parseFile(`${path}${file}`, reCommand, showAll);
            })).then(parsedCmnds => {
                console.log('all files processed!');
                resolve(parsedCmnds);
            }).catch(problems => {
                console.log(`some problem here ${problems}`);
                reject(problems);
            });
        });
    });
};

const parsePath = (path, fileName = 'autocomplete.js', reFile = /.*\.js$/, reCommand = /.addCommand.*\s=>\s{/, eslintDisable = true, showAll = true) => {
    return new Promise((resolve, reject) => {
        isDirectory(path)
            ? parseDirectory(path, reFile, reCommand, showAll).then(cmnd => {
                writeToFile(cmnd, fileName, eslintDisable);
            }).catch(err => {
                reject(err);
            })
            : parseFile(path, reCommand).then(cmnd => {
                writeToFile(cmnd, fileName, eslintDisable, showAll);
            }).catch(err => {
                reject(err);
            });
    });
};

module.exports = {
    isDirectory,
    parseCmds,
    parseDirectory,
    parseFile,
    parsePath,
    writeToFile
};
