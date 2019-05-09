const path = require('path');
const { prompt } = require('inquirer');
const generate = require('./generator');
const {templateType,typeMap} = require('./templateType');

const defaultSetting = {
  // actionDest: '',
  // reducerDest: '',
  // componentDest: '',
  actionDest: 'page/webs/src/Redux/Action',
  reducerDest: 'page/webs/src/Redux/Reducer',
  componentDest: 'page/webs/src/Component',
  templatePath: 'template'
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

  generate(getOptions(templateType.ACTION,moduleName,setting));
  generate(getOptions(templateType.REDUCER,moduleName,setting));
  generate(getOptions(templateType.COMPONENT,moduleName,setting));

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

function getOptions(type,name,setting) {
  const template = setting.templatePath;

  const src = path.resolve(template,type + '.js');

  const dest = path.resolve(setting[typeMap[type]]);

  return {
    src,dest,name,type,setting,template
  }
}
