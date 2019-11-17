import path from "path"
import { ITemplateFile, IRakentajaConfiguration } from '../types/types';
import fs from 'fs-extra';
import shell from 'shelljs';
import getAllFilePathsInDir from "./getAllFilePathsInDir"
import getTemplateFiles from "./getTemplateFiles"
import Mustache from "mustache"
import promptForValues from "./prompForValues"

const renderFiles = (files: ITemplateFile[], values: object) => {
	files.forEach((file: ITemplateFile) => {
		const rendered = Mustache.render(file.template, values);
		fs.outputFile(file.path, rendered);
	});
};
// directory is current directory by default

const renderer = async (source: string, target = './') => {
	// Exit if source folder does not exist
	const sourceFolderExists = fs.existsSync(source);
	if (!sourceFolderExists) {
		throw new Error(`No such template folder: ${source}`);
	}

	// Check if config exists
	const configPath = path.resolve(source, "rakentaja.json")
	let appConfig: IRakentajaConfiguration = {
		commands: [],
		keys: {}
	}
	if (fs.existsSync(configPath)) {
		try {
			appConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))
		} catch (err) {
			throw new Error(`Configuration file ${configPath} is not a valid JSON file!`)
		}
	}

	// First copy templates except rakentaja.json
	
	shell.cp('-R', source, target);
	
	const filePaths = await getAllFilePathsInDir(target);
	const files = await getTemplateFiles(filePaths);
	// Flatten names array
	const allKeys = files
		.map((file: ITemplateFile) => file.names)
		.reduce((acc, names) => [...acc, ...names], []);
	
	const values = (await promptForValues(allKeys, appConfig));
	
	// Render files in target folder
	renderFiles(files, values);
};

export default renderer;
