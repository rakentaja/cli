import {IRakentajaConfiguration} from "../types/types"
import inquirer from "inquirer"

export default (keys: string[],appConfig:IRakentajaConfiguration): Promise<{[key:string]: any}> => {
  if (!keys || keys.length === 0) {
    return new Promise(resolve => resolve({}));
  }
  // Replace default values with the ones existing in config
  const defaults:{[key:string]:any} = {}
  keys.forEach((key) => {
		if (Object.keys(appConfig.keys).includes(key)) {
      defaults[key] = appConfig.keys[key]
      return 
    } 
    defaults[key] = key
  })
  
  // Start asking questions (Turn it into a Set not to ask twice)
  const prompts = [...new Set(keys)].map((key: string) => ({
    type: 'input',
    name:key,
    message: `Please enter ${key}`,
    default: defaults[key],
  }));
  return new Promise(resolve => {
    inquirer.prompt(prompts).then((answers: any) => {
      resolve(answers);
    });
  });
}
