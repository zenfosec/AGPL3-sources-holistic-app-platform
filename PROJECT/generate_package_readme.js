#!/usr/bin/env node

const arctools = require('arctools');
const path = require('path');
const fs = require('fs');

// Information about the most recent build (contains no information specific to a package).
const repoBuild = require('../BUILD/encapsule_repo_build');
const packageDB = require('./package-db/');

const handlebars = arctools.handlebars;
const program = arctools.commander;

program
    .name('generate_package_license')
    .description('Generates LICENSE file from repo build and package DB metadata.')
    .version(repoBuild.version)
    .option('--packageDir <packageDir>', 'Use <packageDir> as root directory of package.')
    .parse(process.argv);

if (!program.packageDir) {
    console.error("Missing --packageDir option value.");
    process.exit(1);
}

if (!fs.existsSync(program.packageDir)) {
    console.error("Invalid --packageDir option value. Directory '" + program.packageDir + "' does not exist.");
    process.exit(1);
}

const targetManifestPath = path.join(program.packageDir, "package.json");
const targetReadmePath = path.join(program.packageDir, "README.md");

if (!fs.existsSync(targetManifestPath)) {
    console.error("Cannot locate target package.json at path '" + targetManifestPath + "'.");
    process.exit(1);
}

const targetManifestJSON = fs.readFileSync(targetManifestPath).toString('utf-8');

var targetManifest = {};

try {
    targetManifest = JSON.parse(targetManifestJSON);
} catch (exception_) {
    console.error("Unable to deserialize target manifest JSON: " + exception_.stack);
    console.error("JSON string obtained from file '" + targetManifestPath + "'.");
    process.exit(1);
}
    
const copyright = targetManifest.contributors[0];
copyright.year = new Date(targetManifest.buildTime * 1000).getFullYear();

// We're interested in the README.md content declared in the package database.
const packageData = packageDB[targetManifest.name];
if (!packageData) {
    console.error("The package '" + targetManifest.name + "' is not registered in the package DB.");
    process.exit(1);
}

// ----------------------------------------------------------------
var markdown = [];

// injectReadmeSection handles sectionDescriptor objects w/heading markdown string & markdown array properties.
function injectReadmeSection(sectionDescriptor_) {
    if (sectionDescriptor_.heading) {
        markdown.push(sectionDescriptor_.heading);
    }
    if (sectionDescriptor_.markdown.length) {
        for (var i = 0 ; i < sectionDescriptor_.markdown.length ; i++) {
            markdown.push(sectionDescriptor_.markdown[i]);
        }
    }
    return;
} // function injectReadmeSection

// Start of the markdown document...
markdown.push("[![Encapsule Project](https://encapsule.io/images/blue-burst-encapsule.io-icon-72x72.png \"Encapsule Project\")](https://encapsule.io)");

markdown.push("### " + repoBuild.author + "");

markdown.push("# " + targetManifest.name + " v" + targetManifest.version + " \"" + targetManifest.codename + "\"");
markdown.push("```\n" +
              "Package: " + targetManifest.name + " v" + targetManifest.version + " \"" + targetManifest.codename + "\" build ID \"" + targetManifest.buildID + "\"\n" +
              "Sources: Encapsule/encapsule_master#" + targetManifest.buildSource + "\n" +
              "Purpose: " + packageData.packageType + " (" + (packageData.browserSafe?"Node.js + modern browsers (via package bundler)":"Node.js") + ")\n" +
              "Created: " + repoBuild.buildDateISO + "\n" +
              "License: " + targetManifest.license + "\n" +
              "```");

markdown.push("# Summary");

markdown.push(targetManifest.description);

////
// Insert optional package-specific content to the Summary section body.
//
if (packageData.packageReadme.summaryDescriptor) {
    injectReadmeSection(packageData.packageReadme.summaryDescriptor);
}

switch (packageData.packageType) {
case 'library':
    injectReadmeSection({
        heading: "## Usage",
        markdown: [
            "This package's contained library functionality is intended for use in derived projects.",
            "For example:",
            "1. Create simple test project, declare a dependency and install `" + targetManifest.name + "` package:",
            "```\n$ mkdir testProject && cd testProject\n$ yarn init\n$ yarn add " + targetManifest.name + " --dev\n```",
            "2. Create a simple script `index.js`:",
            "```JavaScript\nconst " + targetManifest.name + " = require('" + targetManifest.name + "');\nconsole.log(JSON.stringify(" + targetManifest.name + ".__meta));\n/* ... your derived code here ... */\n```"
        ]
    });
    break;
case 'tools':
    injectReadmeSection({
        heading: "## Usage",
        markdown: [
            "The `" + targetManifest.name + "` "  + packageData.packageType + " package is typically installed globally.",
            "```\n$ npm install --global " + targetManifest.name + "\n```"
        ]
    });
    break;
default:
    throw new Error("Unknown packageType declaration value '" + packageData.packageType + "'!");
}

if (packageData.packageReadme.documentationDescriptor) {
    injectReadmeSection(packageData.packageReadme.documentationDescriptor);
}

markdown.push("## Distribution");
markdown.push("The `" + targetManifest.name + "` " + packageData.packageType + " package is published on [npmjs](https://npmjs.com).");
markdown.push([
    "- [" + targetManifest.name + " Package Distribution](https://npmjs.com/package/" + targetManifest.name + "/v/" + targetManifest.version + ") ([npm](https://www.npmjs.com/~chrisrus))",
    "- [" + targetManifest.name + " Package Repository](https://github.com/Encapsule/" + targetManifest.name + ") ([GitHub](https://github.com/Encapsule))"
].join("\n"));


// Body content (after summary section typically).
while (packageData.packageReadme.bodySections && packageData.packageReadme.bodySections.length) {
    injectReadmeSection(packageData.packageReadme.bodySections.shift());
}

////
// Footer
//
markdown.push("<hr>");
markdown.push("Published under [" + targetManifest.license + "](LICENSE) license by [Encapsule Project](https://encapsule.io) Seattle, Washington");
markdown.push("Copyright &copy; " + copyright.year + " [" + copyright.name + "](" + copyright.url + ")");

////
// Final doc preparation
//
const mddoc = markdown.join('\n\n');

////
// Write the README.md document to filesystem.
//
const packageReadmeFilename = path.join(program.packageDir, 'README.md');
fs.writeFileSync(targetReadmePath, mddoc);
console.log("Wrote '" + targetReadmePath + "':");

process.exit(0);

