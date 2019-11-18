import { ITemplateFile } from "../types/types";
import path from "path"
import fs from "fs-extra"
import glob from "glob"
import Mustache from "mustache"
import promptForValues from "../lib/prompForValues";
import shell from "shelljs"
import { RAKENTAJA_TEMP, TEMP_CLONE_NAME } from "../constants"
import URL from "url"
import getConfigFromSourceDir from "../lib/getconfig";
import renderFiles from "../lib/renderer";


const cloneGitRepoToTemporaryFolder = (url: string): string => {
    const cloneTarget = path.resolve(RAKENTAJA_TEMP, TEMP_CLONE_NAME)
    // Ensure folders exist before cloning
    fs.ensureDirSync(RAKENTAJA_TEMP)
    fs.ensureDirSync(cloneTarget)
    // Empty target folder
    fs.removeSync(cloneTarget)
    // if it is a url then clone to temporary folder first
    shell.exec(`git clone ${url} ${cloneTarget}`)    
    return cloneTarget
}

// Renders the template to target directory
export default async ({ source, target = "./" }: { source: string, target: string }) => {
    let sourceDir = source
    const targetDir = target

    // Clone to temporary path if {source} is a valid url
    if (URL.parse(source).hostname) {
        sourceDir = cloneGitRepoToTemporaryFolder(source)
    } else {
        // Exit if source folder does not exist
        const sourceFolderExists = fs.existsSync(sourceDir);
        if (!sourceFolderExists) {
            throw new Error(`No such template folder: ${sourceDir}`);
        }

    }
    // Fetch config if exists, if not return default config
    const appConfig = getConfigFromSourceDir(sourceDir)
    const globOptions = {
        dot: true,
        ignore: ['**/.git/**', "**/rakentaja.json", ...appConfig.ignore],
        nodir: true,
    };
    // Config END

    const files = glob.sync(path.resolve(sourceDir, '**'), globOptions)
        .map((filePath: string) => {
            const template = fs.readFileSync(filePath, 'utf8')
            const targetPath = path.resolve(targetDir, path.relative(sourceDir, filePath))
            // Copy from source to target
            fs.ensureFileSync(targetPath)
            fs.copyFileSync(filePath, targetPath)
            const keys = Mustache.parse(template)
                .filter((k: Array<any>) => k[0] === 'name')
                .map((t: Array<any>) => t[1])
            return {
                template,
                keys,
                sourcePath: filePath,
                targetPath
            }
        })

    // Flatten names array
    const allKeys = files
        .map((file: ITemplateFile) => file.keys)
        .reduce((acc, keys) => [...acc, ...keys], []);

    const values = (await promptForValues(allKeys, appConfig));

    // Render files in target folder
    renderFiles(files, values);

    // Run rakentaja commands after rendering files
    shell.cd(targetDir)
    appConfig.commands.forEach((command:string) => {
        shell.exec(command)
    })
};