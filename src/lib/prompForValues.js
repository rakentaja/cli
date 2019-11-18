import {IRakentajaConfiguration} from "../types/types"
import inquirer from "inquirer"

/**
 * Prompts the user for all template keys given as an array
 * @param {string[]} keys Array of keys
 * @param {IRakentajaConfiguration} appConfig Application config
 * @returns Promise<{[key:string]: any}
 */
const promptForValues = (keys,appConfig) => {
  if (!keys || keys.length === 0) {
    return new Promise(resolve => resolve({}));
  }
  // Replace default values with the ones existing in config
  /** @type {{[key:string]:any}} */
  const defaults = {}
  keys.forEach((key) => {
		if (Object.keys(appConfig.keys).includes(key)) {
      defaults[key] = appConfig.keys[key]
      return 
    } 
    defaults[key] = key
  })
  
  // Start asking questions (Turn it into a Set not to ask twice)
  const prompts = [...new Set(keys)].map((key) => ({
    type: 'input',
    name:key,
    message: `Please enter ${key}`,
    default: defaults[key],
  }));
  return new Promise(resolve => {
    inquirer.prompt(prompts).then((answers) => {
      resolve(answers);
    });
  });
}
export default promptForValues