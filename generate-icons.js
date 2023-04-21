const fs = require('fs');
const path = require('path');

const iconsFolder = './icons';

// Read all files in the icons folder
fs.readdir(iconsFolder, (err, files) => {
  if (err) {
	console.error(err);
	return;
  }

  // Filter out non-SVG files and files with numbers in their names
  const svgFiles = files.filter(file => {
	const ext = path.extname(file);
	const hasNumber = /\d/.test(file);
	return ext === '.svg' && !hasNumber;
  });

  // Generate the .tsx code
  const iconExports = svgFiles.map(file => {
	let iconName = path.basename(file, '.svg').replace(/-/g, '_').toLowerCase();
	const svgCode = fs.readFileSync(path.join(iconsFolder, file), 'utf8');

	// Modify the iconName based on the conditions mentioned
	iconName = iconName.replace(/(_false|_regular)/g, '');
	iconName = iconName.replace(/_true/g, '_fill');

	return `${iconName}: \`${svgCode}\`,`;
  }).join('\n');

  // Add text before and after the list of SVGs
  const someText = `// Welcome to Code in Framer
  // Get Started: https://www.framer.com/docs/guides/
  
  import { addPropertyControls, ControlType } from "framer"
  import React from "react"
  
  const predefinedIcons = {`;
  const someOtherText = `}`;
  const outputContent = `${someText}\n${iconExports}\n${someOtherText}`;

  // Write the .tsx file
  fs.writeFile('./icons.tsx', outputContent, err => {
	if (err) {
	  console.error(err);
	  return;
	}
	console.log('icons.tsx file has been generated successfully!');
  });
});
