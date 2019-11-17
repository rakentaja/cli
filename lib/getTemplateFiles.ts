import fs from "fs-extra"
import extractKeysFromTemplate from "./extractKeysFromTemplate"
import {ITemplateFile} from "../types/types"

/**
 * Loop through the filePaths and returns a Promise
 * that resolves to all names in the template,
 * filePath itself
 * and template to render
 * */

export default (filePaths: Array<string>): Promise<ITemplateFile[]> => {
  const promises = filePaths.map<Promise<ITemplateFile>>(
    filePath =>
      new Promise((resolve, reject) =>
        fs.readFile(filePath, 'utf8', (err, template) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({
            template,
            path: filePath,
            names: extractKeysFromTemplate(template),
          });
        }),
      ),
  );
  return Promise.all(promises);
}
