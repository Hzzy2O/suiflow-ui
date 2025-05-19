import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// executing shell commands
const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
};

// Adding lib folder
const createLibUtilsFile = (projectDir) => {
  const utilsDir = path.join(projectDir, 'lib');
  const utilsPath = path.join(utilsDir, 'utils.ts');

  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }

  if (!fs.existsSync(utilsPath)) {
    const utilsContent = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

    fs.writeFileSync(utilsPath, utilsContent);
    console.log(`Created lib/utils.ts`);
  } else {
    console.log('lib/utils.ts already exists');
  }
};

// Checking if project is already set up with Next.js or not
const init = async () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const hasNextJs = fs.existsSync(packageJsonPath) &&
    JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')).dependencies?.next;

  if (!hasNextJs) {
    runCommand('npx create-next-app@latest my-app --typescript --tailwind --eslint');
    process.chdir(path.join(process.cwd(), 'my-app'));
  } else {
    console.log('Next.js is already set up in this project.');
  }

  // Adding lib/utils.ts after Nextjs setup
  createLibUtilsFile(process.cwd());

  console.log('Your project is now fully set up. You can now add components!');
};

export default init;
