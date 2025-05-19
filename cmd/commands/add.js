import inquirer from 'inquirer';
import fs from 'fs-jetpack';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const components = [
  'connect-button',
  'connect-modal',
  'connector',
  'address-display',
  'balance-display',
  'transaction-notifier',
  'nft-card',
  'token-input',
  'nft-gallery',
  'transaction-history',
  'object-display'
];

const toPascalCase = (str) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

// Add a function to handle special project-local imports (starting with @/)
const handleLocalImports = async (content, projectDir, destination) => {
  // Regular expression to find @/ imports
  const localImportRegex = /from\s+['"](@\/[^'"]+)['"]/g;
  let match;
  const copiedUtilities = new Set();

  while ((match = localImportRegex.exec(content)) !== null) {
    const importPath = match[1]; // e.g. @/lib/utils
    
    // Remove the @ and convert to filesystem path
    const relativePath = importPath.replace(/^@\//, '');
    const sourceFilePath = path.join(projectDir, relativePath);
    const destFilePath = path.join(projectDir, relativePath);
    
    // Check if the source exists in our template
    if (fs.exists(sourceFilePath + '.ts') || fs.exists(sourceFilePath + '.tsx') || 
        fs.exists(sourceFilePath + '.js') || fs.exists(sourceFilePath + '.jsx')) {
      
      // Create the directory structure if it doesn't exist
      fs.dir(path.dirname(destFilePath));
      
      // Determine the correct extension
      let extension = '';
      if (fs.exists(sourceFilePath + '.ts')) extension = '.ts';
      else if (fs.exists(sourceFilePath + '.tsx')) extension = '.tsx';
      else if (fs.exists(sourceFilePath + '.js')) extension = '.js';
      else if (fs.exists(sourceFilePath + '.jsx')) extension = '.jsx';
      
      // Source and destination with correct extension
      const fullSourcePath = sourceFilePath + extension;
      const fullDestPath = destFilePath + extension;
      
      // Copy the file if it doesn't exist or needs updating
      if (!fs.exists(fullDestPath)) {
        try {
          fs.copy(fullSourcePath, fullDestPath);
          copiedUtilities.add(importPath);
          console.log(`Utility file ${importPath} added.`);
          
          // Recursively process this utility file for its own dependencies
          const utilContent = fs.read(fullSourcePath);
          await handleLocalImports(utilContent, projectDir, destination);
        } catch (err) {
          console.error(`Failed to copy utility ${importPath}: ${err.message}`);
        }
      }
    } else {
      console.warn(`Utility ${importPath} referenced but not found in template.`);
    }
  }
  
  return Array.from(copiedUtilities);
};

// Modified to detect both npm dependencies, internal component dependencies, and local utilities
const extractDependencies = (filePath, projectDir) => {
  const content = fs.read(filePath);
  const npmDependencies = [];
  const internalComponents = new Set();
  
  // Process local imports asynchronously
  const processLocalImports = async () => {
    return await handleLocalImports(content, projectDir, projectDir);
  };
  
  // Process component imports and npm packages
  const importRegex = /import\s+(?:.*?\s+from\s+)?['"](.*?)['"]/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const importedModule = match[1];
    
    // Skip React imports
    if (importedModule.startsWith('react')) {
      continue;
    }
    
    // Skip @/ imports as they're handled separately
    if (importedModule.startsWith('@/')) {
      continue;
    }
    
    // Process relative imports (potential internal components)
    if (importedModule.startsWith('./') || importedModule.startsWith('../')) {
      // Try to extract component name from the path
      const parts = importedModule.split('/');
      // Get the last part which might contain the component name
      let componentName = parts[parts.length - 1];
      
      // If it's an index import, check if parent directory is a component
      if (componentName === '' || componentName === 'index') {
        componentName = parts[parts.length - 2] || '';
      }
      
      // Remove file extension if present
      componentName = componentName.replace(/\.[jt]sx?$/, '');
      
      // Convert from PascalCase to kebab-case to match our components array
      const kebabCase = componentName
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
      
      // Check if this kebab-case name exists in our components list
      if (components.includes(kebabCase)) {
        internalComponents.add(kebabCase);
      }
    } else {
      // This is an npm package dependency
      const packageName = importedModule.startsWith('@')
        ? importedModule.split('/').slice(0, 2).join('/')
        : importedModule.split('/')[0];
      npmDependencies.push(packageName); 
    }
  }

  return { 
    npmDependencies, 
    internalComponents: Array.from(internalComponents),
    processLocalImports // Return the async function to be called later
  };
};

const checkInstalledDependencies = (dependencies) => {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.exists(packageJsonPath)) {
    console.error('package.json not found in the project directory.');
    return dependencies; 
  }

  const packageJson = fs.read(packageJsonPath, 'json');
  const installedDependencies = new Set([
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {})
  ]);

  return dependencies.filter(dep => !installedDependencies.has(dep));
};

const installDependencies = (dependencies) => {
  if (dependencies.length > 0) {
    console.log('Installing missing dependencies...');
    console.log(dependencies);
    try {
      execSync(`npm install ${dependencies.join(' ')} --save`, { stdio: 'inherit' });
    } catch (err) {
      console.error('Failed to install dependencies:', err.message);
    }
  }
};

// Modified to handle recursive installation of components
const add = async (component, processedComponents = new Set(), recursiveCall = false) => {
  // Make sure processedComponents is always a Set
  if (!(processedComponents instanceof Set)) {
    processedComponents = new Set(Array.isArray(processedComponents) ? processedComponents : []);
  }

  if (!component) {
    // Interactive component selection
    const answer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'components',
        message: 'Which components would you like to add?',
        choices: components,
      },
    ]);

    component = answer.components;
  } else if (!Array.isArray(component)) {
    component = [component];
  }

  const projectDir = process.cwd();
  let destination;

  // Determine target directory
  // Check for `app/components/ui` directory
  const appDir = path.join(projectDir, 'components', 'ui');
  const srcAppDir = path.join(projectDir, 'src', 'components', 'ui');
  const rootDir = path.join(projectDir, 'components', 'ui');

  if (fs.exists(path.join(projectDir, 'app'))) {
    destination = appDir;
  } else if (fs.exists(path.join(projectDir, 'src'))) {
    destination = srcAppDir;
  } else {
    destination = rootDir;
  }

  // Ensure destination directory exists
  fs.dir(destination);

  const requiredNpmDependencies = new Set();

  for (const comp of component) {
    // Skip if we've already processed this component
    if (processedComponents.has(comp)) {
      if (!recursiveCall) {
        console.log(`Component ${comp} is already installed.`);
      }
      continue;
    }
    
    // Mark this component as processed
    processedComponents.add(comp);
    
    const pascalCaseName = toPascalCase(comp);
    const compPath = path.join(__dirname, `../components/${pascalCaseName}.tsx`);
    const destPath = path.join(destination, `${pascalCaseName}.tsx`);

    if (fs.exists(compPath)) {
      if (fs.exists(destPath)) {
        // Skip prompting for overwrite in recursive calls
        let overwrite = recursiveCall;
        
        if (!recursiveCall) {
          // Prompt user if file already exists in destination
          const response = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'overwrite',
              message: `The component ${pascalCaseName} already exists. Do you want to overwrite it?`,
              default: false,
            },
          ]);
          overwrite = response.overwrite;
        }

        if (!overwrite) {
          console.log(`Skipped ${pascalCaseName}.`);
          continue;
        }
      }

      try {
        fs.copy(compPath, destPath, { overwrite: true });
        if (!recursiveCall) {
          console.log(`${pascalCaseName} component added successfully.`);
        } else {
          console.log(`Dependency ${pascalCaseName} installed automatically.`);
        }
      } catch (err) {
        console.error(`Failed to copy ${pascalCaseName}: ${err.message}`);
      }

      // Extract dependencies
      const { npmDependencies, internalComponents, processLocalImports } = 
        extractDependencies(compPath, projectDir);
      
      // Add NPM dependencies to our collection
      npmDependencies.forEach(dep => requiredNpmDependencies.add(dep));
      
      // Process local utilities (@/ imports)
      try {
        const copiedUtilities = await processLocalImports();
        if (copiedUtilities.length > 0) {
          console.log(`Copied utility files: ${copiedUtilities.join(', ')}`);
        }
      } catch (err) {
        console.error(`Error processing local imports: ${err.message}`);
      }
      
      // Recursively add internal component dependencies
      if (internalComponents.length > 0) {
        console.log(`Component ${pascalCaseName} requires: ${internalComponents.join(', ')}`);
        // Call add() recursively with internal components
        await add(internalComponents, processedComponents, true);
      }
    } else {
      console.error(`Component ${pascalCaseName} not found.`);
    }
  }

  // Only install NPM dependencies at the top level call, not in recursive calls
  if (!recursiveCall) {
    // Check which dependencies need to be installed
    const dependenciesToInstall = checkInstalledDependencies(Array.from(requiredNpmDependencies));

    // Install missing dependencies
    installDependencies(dependenciesToInstall);
  }
};

export default add;
