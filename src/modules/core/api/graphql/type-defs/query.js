import _ from 'lodash'

export default modules => {
  const typeQueries = modules.map(({ model }) => {
    const {
      modelName, pluralModelName, idField, gqlSchema, skipDefaultCRUDSchema
    } = model
    const camelCaseModelName = _.camelCase(modelName)
    const defaultCRUDSchema = [
      `  all${pluralModelName}(first: Int, offset: Int, orderBy: [${pluralModelName}OrderBy!] = [PRIMARY_KEY_ASC], filter: ${modelName}Filter): ${pluralModelName}Connection!`,
      `  ${camelCaseModelName}ById(id: ${(idField || { gqlType: 'ID!' }).gqlType}!): ${modelName}`,
      `  ${camelCaseModelName}(nodeId: ID!): ${modelName}`
    ]
    const strBuffer = []
    if (skipDefaultCRUDSchema !== true) {
      strBuffer.push(...defaultCRUDSchema)
    }
    if (!_.isEmpty(gqlSchema) && !_.isEmpty(gqlSchema.queries)) {
      gqlSchema.queries.forEach(({ typeDef }) => {
        if (typeDef) {
          strBuffer.push(`  ${typeDef}`)
        }
      })
    }
    return strBuffer.join('\n')
  })
  const rootQueries = [
    'type Query implements Node {',
    '  nodeId: ID!',
    '  node(nodeId: ID!): Node',
    ...typeQueries,
    '}\n'
  ]
  return rootQueries.join('\n')
}
