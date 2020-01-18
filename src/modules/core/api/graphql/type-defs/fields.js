import _ from 'lodash'

export default modules => modules.map(({ model }) => {
  const {
    modelName, fields, fieldsWithRelation, gqlSchema, skipDefaultCRUDSchema
  } = model
  const gqlDirective = (() => {
    if (gqlSchema) {
      const { directive } = gqlSchema
      if (directive) {
        return `${_.isFunction(directive) ? directive() : directive} `
      }
    }
    return ''
  })()
  const strBuffer = skipDefaultCRUDSchema !== true ? [
    `type ${modelName} implements Node ${gqlDirective}{`,
    '  nodeId: ID!',
    ...fields.map(f => `  ${f.gqlFieldDef} ${f.gqlDirective}`),
    ...fieldsWithRelation.map(f => `  ${f.gqlFieldDef}`),
    '}\n'
  ] : []
  // $logger.info(strBuffer.join('\n'))
  return strBuffer.join('\n')
})
