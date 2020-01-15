#!/usr/bin/env node

const arctools = require('@encapsule/arctools');
const path = require('path');
const fs = require('fs');

// Information about the most recent build (contains no information specific to a package).
const repoBuild = require('../../BUILD/holistic');
const holisticPackages = require("../../BUILD/holistic-rtl-packages");
const packageDB = require('./PACKAGES/');

const program = arctools.commander;

program
    .name('generate-package-readme')
    .description('Generates README.md file from repo build and package DB metadata.')
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

const packageNameSplit = targetManifest.name.split("/");
const packageOrg = packageNameSplit[0];
const packageNameTerse = packageNameSplit[1];

// ----------------------------------------------------------------
var markdown = [];

// the injectReadmeSection function processes sectionDescriptor objects w/heading markdown string & markdown array properties.
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
// https://github.com/Encapsule/holistic/tree/v0.0.32-jeunelanding

markdown.push("# [![Encapsule Project](ASSETS/blue-burst-encapsule.io-icon-72x72.png \"Encapsule Project\")](https://encapsule.io) Encapsule Project");

markdown.push("# " + targetManifest.name + " v" + targetManifest.version + " " + targetManifest.codename);

markdown.push("**" + targetManifest.description + "**");

markdown.push("```\n" +
              "Package: " + targetManifest.name + " v" + targetManifest.version + " \"" + targetManifest.codename + "\" build ID \"" + targetManifest.buildID + "\"\n" +
              "Sources: Encapsule/holistic-master#" + targetManifest.buildSource + "\n" +
              "Purpose: " + packageData.packageType + " (" + (packageData.browserSafe?"Node.js + modern browsers (via package bundler)":"Node.js") + ")\n" +
              "Created: " + repoBuild.buildDateISO + "\n" +
              "License: " + targetManifest.license + "\n" +
              "```");

markdown.push("[![@encapsule/holistic](ASSETS/encapsule-holistic-16x16.png \"@encapsule/holistic\")](https://encapsule.io/docs/holistic) This package is part of the  Holistic Application Platform v" + targetManifest.version + " **" + targetManifest.codename + "** release distribution.");

markdown.push("## Overview");

////
// Insert optional package-specific content to the description section
//
if (packageData.packageReadme.overviewDescriptor) {
    injectReadmeSection(packageData.packageReadme.overviewDescriptor);
}


markdown.push("## Distribution");
markdown.push("The `" + targetManifest.name + "` " + packageData.packageType + " package can be obtained from:");
markdown.push([
    "- npmjs.com: [" + targetManifest.name + " v" + targetManifest.version + " " + targetManifest.codename + "](https://npmjs.com/package/" + targetManifest.name + "/v/" + targetManifest.version + ") " +
        "([@encapsule on npmjs.com](https://www.npmjs.com/org/encapsule))",
    "- GitHub.com: [Encapsule/" + packageNameTerse + " v" + targetManifest.version + " " + targetManifest.codename + "](https://github.com/Encapsule/" + packageNameTerse + ") ([GitHub](https://github.com/Encapsule))"
].join("\n"));


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
            "```JavaScript\nconst " + packageNameTerse + " = require('" + targetManifest.name + "');\nconsole.log(JSON.stringify(" + packageNameTerse + ".__meta));\n/* ... your derived code here ... */\n```"
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


// Documentation section (typically not the actual developer reference but links to other resources here).
if (packageData.packageReadme.usageDescriptor) {
    injectReadmeSection(packageData.packageReadme.usageDescriptor);
}


markdown.push("## Issues");
markdown.push("Please post bug reports to one of the follow issue queues depending on topic:");
markdown.push("- @encapsule/holistic [GitHub Issues](https://github.com/Encapsule/holistic/issues) - Holistic platform RTL + appgen issues.");
markdown.push("- @encapsule/arccore [GitHub Issues](https://github.com/Encapsule/ARCcore/issues) - Core data RTL issues.");
markdown.push("- @encapsule/arctools [GitHub Issue](https://github.com/Encapsule/ARCtools/issues) - Core data tools and RTL issues.");


// Body content (any other package-specific content to be inserted into the README.md document after the package summary and before the footer sections.
if (packageData.packageReadme.bodySections && packageData.packageReadme.bodySections.length) {
    markdown.push("## Documentation");
    while (packageData.packageReadme.bodySections.length) {
	injectReadmeSection(packageData.packageReadme.bodySections.shift());
    }
}


if (targetManifest.name === "@encapsule/holistic") {

    markdown.push("[![encapsule/holistic](ASSETS/encapsule-holistic-48x48.png \"@encapsule/holistic\")](https://encapsule.io/docs/holistic)");
    markdown.push("### Holistic Platform");
    markdown.push("The \"Holistic App Platform\" is a collection of runtime library packages that are used to build full-stack web applications and services using [Node.js](https://nodejs.org) and [React](https://react.org).");


    holisticPackages.forEach(function(packageName_) {
	markdown.push("#### " + packageName_);
	markdown.push(packageDB[packageName_].packageManifestOverrides.description);
	markdown.push("[README](PACKAGES/" + packageName_.split("/")[1] + "/README.md)");
    });

}


////
// Footer
//
markdown.push("<hr>");
markdown.push("[![Encapsule Project](ASSETS/blue-burst-encapsule.io-icon-72x72.png \"Encapsule Project\")](https://encapsule.io)");
markdown.push("Published under [" + targetManifest.license + "](LICENSE) license by [Encapsule Project](https://encapsule.io)");
markdown.push("Please follow [@Encapsule](https://twitter.com/encapsule) on Twitter for news and updates.");
markdown.push("Copyright &copy; " + copyright.year + " [" + copyright.name + "](" + copyright.url + ") Seattle, Washington USA");
markdown.push("<hr>");

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

