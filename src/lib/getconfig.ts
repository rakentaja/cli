import { IRakentajaConfiguration } from "../types/types";
import path from "path"
import fs from "fs-extra"
import { RAKENTAJA_CONFIG } from "../constants";

export default (sourceDir:string):IRakentajaConfiguration => {
    const configPath = path.resolve(sourceDir, RAKENTAJA_CONFIG)
    let appConfig: IRakentajaConfiguration = {
        commands: [],
        keys: {},
        ignore: []
    }
    if (fs.existsSync(configPath)) {
        try {
            appConfig = {...appConfig,...JSON.parse(fs.readFileSync(configPath, 'utf8'))}
        } catch (err) {
            throw new Error(`Configuration file ${configPath} is not a valid JSON file!`)
        }
    }
    return appConfig
}
