import chalk from "chalk";
import gradient from "gradient-string";
import inquirer from "inquirer";
import child from "child_process";
import util from "util";
import figlet from "figlet";
import ora from "ora";
import path from "path";
import pkg from "ncp";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const { ncp } = pkg;
const asyncExec = util.promisify(child.exec);
let projectName, installPackage, framework, ui;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  figlet(`Welcome, Bro!\n Front-End Starter`, (err, data) => {
    console.log(gradient.pastel.multiline(data) + "\n");
  });
  await sleep();
}

async function askProjectName() {
  const answers = await inquirer.prompt({
    name: "project_name",
    type: "input",
    message: "What is your project name?",
    default() {
      return "my-app";
    },
  });

  projectName = answers.project_name;
}

async function askFramework() {
  const answers = await inquirer.prompt({
    name: "framework",
    type: "list",
    message: "Select the template?",
    choices: ["react", "react-ts", "vue", "vue-ts"],
  });

  framework = answers.framework;
}

async function askPackage() {
  const answers = await inquirer.prompt({
    name: "install_package",
    type: "list",
    message: "Select npm / yarn\n",
    choices: ["npm", "yarn"],
  });

  installPackage = answers.install_package;
}

async function askUI() {
  const answers = await inquirer.prompt({
    name: "ui",
    type: "list",
    message: "Select UI\n",
    choices: ["Tailwind", "none"],
  });

  ui = answers.ui;
}

async function startCreateReactProject(spinner) {
  spinner.start();
  spinner.text = "Creating Project 1212...\n";
  await asyncExec(
    installPackage === "npm"
      ? `npm create vite@latest ${projectName} -- --template ${framework}`
      : `yarn create vite ${projectName} --template ${framework}`
  );
  spinner.succeed("Create Project Done...\n");
}

/**
 * @method copyProjectFiles
 * @description Duplicate the template.
 */
const copyProjectFiles = async (destination, directory) => {
  return new Promise((resolve, reject) => {
    const source = `${__filename.replace("starter.js", directory)}`;
    const options = {
      clobber: true,
      stopOnErr: true,
    };

    ncp.limit = 16;
    ncp(source, destination, options, function (err) {
      if (err) reject(err);
      resolve();
    });
  });
};

async function addTailwind(spinner) {
  spinner.start();
  spinner.text = "Setting Up Tailwind 1212...\n";
  await asyncExec(
    `npx add-dependencies ./package.json tailwindcss postcss autoprefixer --dev`,
    { cwd: projectName }
  );
  spinner.succeed("Tailwind Setup Done...\n");
}

function finish(spinner) {
  spinner.succeed(`All Done...\n`);
  figlet(
    `Congrats Bro, \n${framework} - ${projectName} !\n Are Ready!!!`,
    (err, data) => {
      console.log(gradient.pastel.multiline(data) + "\n");
      console.log(`
      ${chalk.bgBlue("How To Start?")} 
      ${chalk.green("Now run:")} 
      cd ${projectName}
      ${installPackage === "npm" ? "npm install" : "yarn install"}
      ${installPackage === "npm" ? "npm run dev" : "yarn dev"}
    `);
      process.exit(0);
    }
  );
}

/**
 * @method createProject
 * @description Create a project
 */
export default async (_projectName) => {
  let spinner;
  try {
    await welcome();
    if (_projectName) {
      projectName = _projectName;
    } else {
      await askProjectName();
    }
    await askFramework();
    await askPackage();
    await askUI();
    spinner = ora();
    await startCreateReactProject(spinner);

    if (ui === "Tailwind") {
      await copyProjectFiles(projectName, `template/tailwind/${framework}`);
      await addTailwind(spinner);
    }
    finish(spinner);
  } catch (error) {
    console.error(error);
  }
};
