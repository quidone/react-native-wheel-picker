const fs = require('fs');
const path = require('path');

const comparableFields = ['dependencies', 'devDependencies'];

const readPackageJson = (packagePath) =>
  JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const getComparableDeps = (packageJson) => {
  const deps = new Map();

  for (const field of comparableFields) {
    const entries = packageJson[field] ?? {};

    for (const [name, version] of Object.entries(entries)) {
      deps.set(name, {field, version});
    }
  }

  return deps;
};

const rootDir = path.resolve(__dirname, '..');
const rootPackage = readPackageJson(path.join(rootDir, 'package.json'));
const examplePackage = readPackageJson(
  path.join(rootDir, 'example', 'package.json'),
);

const rootDeps = getComparableDeps(rootPackage);
const exampleDeps = getComparableDeps(examplePackage);

const mismatches = [...rootDeps.entries()]
  .filter(([name]) => exampleDeps.has(name))
  .map(([name, rootDep]) => {
    const exampleDep = exampleDeps.get(name);

    return {
      name,
      rootDep,
      exampleDep,
    };
  })
  .filter(({rootDep, exampleDep}) => rootDep.version !== exampleDep.version);

if (mismatches.length > 0) {
  console.error(
    'Shared dependency versions must match root package.json and example/package.json.',
  );
  console.error('');

  for (const {name, rootDep, exampleDep} of mismatches) {
    console.error(
      [
        `- ${name}`,
        `root ${rootDep.field}: ${rootDep.version}`,
        `example ${exampleDep.field}: ${exampleDep.version}`,
      ].join(' | '),
    );
  }

  process.exit(1);
}

console.log('Shared dependency versions are aligned.');
