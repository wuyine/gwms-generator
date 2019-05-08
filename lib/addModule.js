const path = require('path');
const { prompt } = require('inquirer');


const defaultSetting = {
  actionDest: './page/webs/src/Redux/Action/',
  reducerDest: './page/webs/src/Redux/Reducer/',
  componentDest: './page/webs/src/Component/',
  templatePath: ''
}
const questions = [
  {
    type: 'input',
    name: 'templatePath',
    default: defaultSetting.templatePath,
  },
  {
    type: 'input',
    name: 'componentDest',
    default: defaultSetting.componentDest,
  },
  {
    type: 'input',
    name: 'reducerDest',
    default: defaultSetting.reducerDest,
  },
  {
    type: 'input',
    name: 'actionDest',
    default: defaultSetting.actionDest,
  }
]

async function addModule(moduleName,options) {

  let setting;
  //const setting = getSetting(Object.assign({},defaultSetting,{}),options);
  let useDefault = await prompt([
    {
      type: 'confirm',
      name: 'default',
    }
  ]).then(ans => {
    return ans.default
  });
  if (useDefault) {
    setting = getSetting(defaultSetting,options)
  }else {
    setting = await prompt(questions).then(ans => {
      return getSetting(ans,options)
    })
  }

  console.log(setting)



}


module.exports = (...args) => {
  return addModule(...args).catch(err => {
    process.exit(1);
  })
}


function getSetting(set,options) {
  const cwd = options.cwd || process.cwd();
  return Object.keys(set).reduce((res,key) => {
    res[key] = path.resolve(cwd,set[key])
    return res;
  },{})
}
