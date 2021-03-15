const fs = require('fs');
const { execSync } = require('child_process');

const packageJson = JSON.parse(
  fs.readFileSync(`${process.argv[2]}/package.json`)
);

Object.keys(packageJson.dependencies).forEach((dep) => {
  if (dep.includes('@apollosproject')) {
    packageJson.dependencies[dep] = `link:/../packages/apollos-${
      dep.split('/')[1]
    }`;
  }
});

Object.keys(packageJson.devDependencies).forEach((dep) => {
  if (dep.includes('@apollosproject')) {
    packageJson.devDependencies[dep] = `link:/../packages/apollos-${
      dep.split('/')[1]
    }`;
  }
});

fs.writeFileSync(
  `${process.argv[2]}/package.json`,
  JSON.stringify(packageJson, null, 2)
);
