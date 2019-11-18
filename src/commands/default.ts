import shell from "shelljs"
import os from "os"
import URL from "url"
import path from "path"
import glob from "glob"
import Mustache from "mustache"
import promptForValues from "../lib/prompForValues"
import getconfig from "../lib/getconfig"
import fs from "fs-extra"
import chalk from "chalk"

export default async ({ source, target }: { source: string, target: string }) => {
    // Keep first working directory path
    const WORKING_DIR = process.cwd()
    let sourceDir = path.resolve(source)
    let targetDir = path.resolve(WORKING_DIR,target)
    
    // If git url
    if (URL.parse(source).hostname) {
        if (!shell.which('git')) {
            shell.echo('Sorry, you need git installed! Visit https://git-scm.com/book/en/v2/Getting-Started-Installing-Git');
            process.exit(1)
        }

        const cloneTarget = path.resolve(os.homedir(), ".rakentaja/temp")
        // Create folders until cloneTarget
        shell.mkdir('-p', cloneTarget)
        shell.rm('-rf', cloneTarget)
        shell.exec(`git clone ${source} ${cloneTarget}`)
        sourceDir = cloneTarget
    } else if(!fs.existsSync(sourceDir)) {
        throw new Error(chalk.red(`Folder ${sourceDir} does not exist!`))
    }

    /*********************************************
     *  ========= START ACTIONS HERE =========
    **********************************************/
    
    // Get config
    const config = getconfig(sourceDir)

    // All files in source folder
    const files:string[] = glob.sync(`**`, { dot: true, cwd: sourceDir, nodir: true, ignore: ["**/.git/**","**/rakentaja.json", ...config.ignore] })
    
    // All file contents
    shell.cd(sourceDir)
    const allFileContents = shell.cat(files).stdout
    const keys = Mustache.parse(allFileContents)
        .filter((token: [...any[]]) => token[0] === "name")
        .reduce((acc: [], curr: any) => [...acc, curr[1]], [])

    const keyValues = await promptForValues(keys, config)

    // Copy files to target
    shell.mkdir('-p',path.resolve(targetDir))
    
    // Copy glob result
    files.forEach((filePath:string) => {
        const targetFilePath = path.resolve(targetDir,filePath)
        fs.ensureFileSync(targetFilePath)
        shell.cp(filePath,targetFilePath)
    })
    
    // Render and write back files
    glob.sync(`**`, { dot: true, cwd: targetDir, nodir: true })
    .forEach((filePathInTarget:string) => {
        const template = fs.readFileSync(filePathInTarget, 'utf8')
        const rendered = Mustache.render(template, keyValues)
        fs.writeFileSync(path.resolve(targetDir,filePathInTarget),rendered)
    })
    // Run Commands in Rakentaja Config
    config.commands.forEach((command:string) => {
        console.log(chalk.grey(`Running rakentaja command : `), chalk.yellow(command))
        shell.exec(command,{cwd:targetDir})
    })
    console.log(chalk.green(`Render finished!`))
}