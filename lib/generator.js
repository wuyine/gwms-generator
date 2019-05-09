const path = require('path');
const fs = require('fs');
const { prompt } = require('inquirer');
const chalk = require('chalk');
const metalsmith = require('metalsmith');
const render = require('consolidate').handlebars.render;

module.exports = async ({src,dest,name,type,template}) => {
  if (!fs.existsSync(template)) {
    console.log();
    console.error(chalk.red(`Template folder (${template}) doesn't exist`));
    return;
  }
  if (!fs.existsSync(src)) {
    console.log();
    console.error(chalk.red(`'${type}' template folder doesn't exist in ${template}`));
    return;
  }
  const target = path.resolve(dest,replaceVars(type,name)+'.js')
  if (fs.existsSync(target)) {
    console.error(chalk.red(`${target} is exist`))
    return;
  }

  console.log();
  console.log(chalk.green(chalk.bold(`Generating files from '${type}' template with name: ${name}`)));

  metalsmith(template)
    .metadata({name})
    .source('.')
    .ignore((p) => p.indexOf(type) < 0)
    .destination(dest)
    .clean(false)
    .use(renderPath)
    .use(renderTemplate)
    .build(function (err) {
      if (err) {
        console.error(chalk.red(err));
      }
      else {
        console.log();
        console.log(chalk.green('Done!'));
      }
    });

}

function renderPath(files,metalsmith, done) {
  const keys = Object.keys(files);
  const metadata = metalsmith.metadata();
  keys.forEach((key) => {
    let newKey = replaceVars(key, metadata.name);

    if (newKey != key) {
      files[newKey] = files[key];
      delete files[key];
    }
  });
  done()
}

function renderTemplate(files, metalsmith, done) {
  let keys = Object.keys(files);
  const metadata = metalsmith.metadata();
  let file = files[keys[0]];
  let str = file.contents.toString();
  render(str, metadata, function (err, res) {
    if (err) {
      return done(err);
    }
    file.contents = Buffer.from(res);
    done();
  });
}

function replaceVars(value, name) {
  return value.replace(/\{(.*)\}/gi, name)
}
