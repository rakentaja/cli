import fs from 'fs-extra';
import path from 'path';
import {IRakentajaConfiguration} from "../types/types"

export default (templateFolderPath: string): IRakentajaConfiguration => {
  const configFilePath = path.resolve(templateFolderPath, 'rakentaja.json');
  const configurationFileExists = fs.existsSync(configFilePath);
  if (configurationFileExists) {
    try {
      const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8')) ;
			return config
    } catch (err) {
      throw new Error(
        `Configuration file ${configFilePath} is not a valid json!`,
      );
    }
  }

  return {
    keys: {},
    commands: [],
  };
};
