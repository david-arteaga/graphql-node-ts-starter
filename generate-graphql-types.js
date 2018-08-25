'use strict';
const { introspectSchema } = require('apollo-codegen');
const { generateNamespace } = require('@gql2ts/from-schema');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { resolve } = require('path');

const folder = './generated/';
const graphqlPath = folder + 'graphql/';
const schemaInput = folder + 'graphql/temp.graphql';
const jsonOutput = folder + 'graphql/temp.json';
const dtsOutput = folder + 'graphql/graphql.schema.d.ts';

async function regen(sourceRoot, callback) {
  try {
    cleanTempFiles();
    await combineSchema(sourceRoot, schemaInput);
    await introspectSchema(schemaInput, jsonOutput);
    // .then(() => {
    const jsonInput = JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
    const dts = generateNamespace('GQL', jsonInput, {
      ignoreTypeNameDeclaration: true
    });
    fs.writeFileSync(dtsOutput, dts);
    callback && callback();
    // })
    // .catch(err => {
    // console.log(err);
    // })
    // .then(() => {
    // cleanTempFiles();
    // });
  } catch (e) {
    callback();
    console.error(e);
  }
  sourceRoot = sourceRoot || './src/';
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  if (!fs.existsSync(graphqlPath)) {
    fs.mkdirSync(graphqlPath);
  }
}

function cleanTempFiles() {
  if (fs.existsSync(schemaInput)) {
    fs.unlinkSync(schemaInput);
  }
  if (fs.existsSync(jsonOutput)) {
    fs.unlinkSync(jsonOutput);
  }
}

async function combineSchema(sourceRoot, outputFilename) {
  const files = await getFiles(sourceRoot);

  const graphqlDefinitions = [];
  files.forEach(file => {
    const gqlTagContents = getGqlTagsContentsFromFile(file);
    gqlTagContents.forEach(d => graphqlDefinitions.push(d));
  });
  const schemas = files.filter(f => f.endsWith('.graphql'));
  const outputFile = fs.openSync(outputFilename, 'ax');
  graphqlDefinitions.forEach(s => {
    fs.appendFileSync(outputFile, s);
  });
  fs.closeSync(outputFile);
}

const regex = /gql`([^`]+)`/g;
function getGqlTagsContentsFromFile(file) {
  const content = fs.readFileSync(path.resolve(file)).toString();
  const graphqls = [];
  (content.match(regex) || []).forEach(match =>
    graphqls.push(match.slice(4, -1))
  );
  return graphqls;
}

const readdir = promisify(fs.readdir);
const rename = promisify(fs.rename);
const stat = promisify(fs.stat);

async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async subdir => {
      const res = resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    })
  );
  return files.reduce((a, f) => a.concat(f), []);
}

if (module === require.main) {
  regen();
}

module.exports = regen;
