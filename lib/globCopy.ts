import fs from "fs"
import path from "path"
import glob from "glob"

const copy = function (files: string[], destFolder: string) {
    const promises = files.map(filename => {
        return new Promise((resolve) => {
            const out = fs.createWriteStream(path.join(destFolder, path.basename(filename)));
            const t = fs.createReadStream(filename).pipe(out);
            t.on('end', function () {
                resolve()
            })
        })        
    });
    return Promise.all(promises)
}

const cp = function (pattern: string, destFolder: string, cb: (...args: any) => void) {
    return new Promise((resolve,reject) => {
        glob(pattern, {
            dot: true,
            ignore: ['**/node_modules/**', '**/.git/**', "**/rakentaja.json"],
            nodir: true,
          }, function(
            err: any,
            templateFilePaths: Array<string>,
          ) {
            resolve(copy(templateFilePaths, destFolder))
          });
    })
}

// const cpSync = function (pattern: string, destFolder: string) {
//     copy(glob.sync(pattern), destFolder);
// }

export default cp