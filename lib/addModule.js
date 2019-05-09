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
  componentDest: 'page/webs/src/Component/{name}',
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
  let customNames = {};
  if ([...new Set([setting.actionDest,setting.reducerDest,setting.componentDest])].length < 3) {
    customNames = await prompt([
      {
        type: 'input',
        name: 'component',
        default: moduleName + 'Component',
      },
      {
        type: 'input',
        name: 'reducer',
        default: moduleName + 'Reduce',
      },
      {
        type: 'input',
        name: 'action',
        default: moduleName + 'Action',
      }
    ])
  }

  generate(getOptions(templateType.ACTION,customNames.action || moduleName,setting));
  generate(getOptions(templateType.REDUCER,customNames.reducer || moduleName,setting));
  generate(getOptions(templateType.COMPONENT,customNames.component || moduleName,setting));

}


module.exports = (...args) => {
  return addModule(...args).catch(err => {
    process.exit(1);
  })
}


function getSetting(set,options) {
  const cwd = options.cwd || process.cwd();
  return Object.keys(set).reduce((res,key) => {
    let name = set[key];
    if (name === '' || name === '.') {
      name = cwd
    }
    res[key] = path.resolve(cwd,name)
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
