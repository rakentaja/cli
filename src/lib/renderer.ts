import fs from 'fs-extra';
import Mustache from "mustache"
import { ITemplateFile } from '../types/types';


const renderFiles = (files: ITemplateFile[], values: object) => {
	files.forEach((file: ITemplateFile) => {
		const rendered = Mustache.render(file.template, values);
		fs.writeFileSync(file.targetPath, rendered);
	});
};
// directory is current directory by default



export default renderFiles;
