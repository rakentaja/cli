import { IRakentajaConfiguration } from "../types/types";
import path from "path"
import fs from "fs-extra"

export default (sourceDir:string):IRakentajaConfiguration => {
    const configPath = path.resolve(sourceDir, "rakentaja.json")
    let appConfig: IRakentajaConfiguration = {
        commands: [],
        keys: {},
        ignore: []
    }
    if (fs.existsSync(configPath)) {
        try {
            appConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))
        } catch (err) {
            throw new Error(`Configuration file ${configPath} is not a valid JSON file!`)
        }
    }
    return appConfig
}