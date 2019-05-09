exports.templateType = {
  ACTION: '{action}',
  REDUCER: '{reducer}',
  COMPONENT: '{component}',
}

exports.typeMap = {
  [exports.templateType.ACTION]: 'actionDest',
  [exports.templateType.REDUCER]: 'reducerDest',
  [exports.templateType.COMPONENT]: 'componentDest',
}
