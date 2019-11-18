import path from "path"
import { ITemplateFile, IRakentajaConfiguration } from '../types/types';
import fs from 'fs-extra';
import glob from "glob"
import Mustache from "mustache"
import promptForValues from "./prompForValues"

/**
 * 
 * @param files {ITemplateFile[]}
 * @param values {object}
 */
const renderFiles = (files, values) => {
	files.forEach((file) => {
		const rendered = Mustache.render(file.template, values);
		fs.writeFileSync(file.targetPath, rendered);
	});
};
// directory is current directory by default

/**
 * Renders the template to target directory
 * @param sourceDir {string} Source directory to collect template files from
 * @param targetDir Target directory to copy the files and render
 */
const renderer = async (sourceDir, targetDir = './') => {
	// Exit if source folder does not exist
	const sourceFolderExists = fs.existsSync(sourceDir);
	if (!sourceFolderExists) {
		throw new Error(`No such template folder: ${sourceDir}`);
	}

	// Check if config exists
	const configPath = path.resolve(sourceDir, "rakentaja.json")
	/**  @type IRakentajaConfiguration */
	let appConfig = {
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
	const globOptions = {
		dot: true,
		ignore: ['**/.git/**', "**/rakentaja.json", ...appConfig.ignore],
		nodir: true,
	};
	// Check if config exists END
	/** @type {Array<{
				template:string
				keys:string[]
				sourcePath:string
				targetPath:string
			}>} */
	const files = glob.sync(path.resolve(sourceDir, '**'), globOptions)
		.map(filePath => {
			const template = fs.readFileSync(filePath, 'utf8')
			const targetPath = path.resolve(targetDir, path.relative(sourceDir, filePath))
			// Copy from source to target
			fs.ensureFileSync(targetPath)
			fs.copyFileSync(filePath, targetPath)
			/** @type string[] */
			const keys = Mustache.parse(template)
			.filter(
				/** @param {Array<string>} k */
				(k) => k[0] === 'name')
			.map(
				/** @param {Array<string>} t */
				(t) => t[1]
			)
			return {
				template,
				keys,
				sourcePath: filePath,
				targetPath
			}
		})
		
	// Flatten names array
	const allKeys = files
		.map((file) => file.keys)
		.reduce((acc, keys) => [...acc, ...keys], []);
		
	const values = (await promptForValues(allKeys, appConfig));

	// Render files in target folder
	renderFiles(files, values);
};

export default renderer;
