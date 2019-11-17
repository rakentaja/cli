<center><img src="assets/logo.png" /></center>

## Motivation
Are you sick of configuring your projects from scratch over and over again ? 

Are you a library author ?

Do you experiment much ?

This is the tool you need.

## Installation

Install globally with `npm i -g @rakentaja/cli` or  `yarn global add @rakentaja/cli`

## Configuration

Add a `rakentaja.json` to the root of your tempaltes folder having the structure : 

```
{
  keys: {[key:string]:any} // Default keys for the templates in the project
  commands: string[]; // Commands to run after project is created
  ignore: string[] // An array of glob strings
}

```

## Usage

```
rakentaja <source> [target]

Create a project from template

Positionals:
  source  Source directory or a git URL. If that is a valid git URL, rakentaja
          will attempt to clone the repository.
          NOTE: Git support will arive in next major version!           [string]
  target  Target directory to generate project          [string] [default: "./"]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

Pass the template directory : 
```
rakentaja myTemplateFolder ./MyProject
```

# Roadmap
- Support `.zip` packages for templates
- Add git support


## Known Issues

**!!! Git support is not working yet!**

## Contribution

Feel free to add tests and report bugs.

Please make a pull request to [dev](https://github.com/rakentaja/cli/tree/dev) branch

And **please do not forget to bump the version!** [Check out SemVer](https://semver.org)

## Credits

## LICENCE


