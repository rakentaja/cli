import path from "path"
import glob from "glob"

const globOptions = {
  dot: true,
  ignore: ['**/node_modules/**', '**/.git/**', "**/rakentaja.json"],
  nodir: true,
};

const getAllFilesInDir = (dir: string): Promise<Array<string>> => {
  // Get all files under globPath
  return new Promise((resolve, reject) => {
    glob(path.resolve(dir, '**'), globOptions, function(
      err: any,
      templateFilePaths: Array<string>,
    ) {
      return err ? reject(err) : resolve(templateFilePaths);
    });
  });
}

export default getAllFilesInDir
