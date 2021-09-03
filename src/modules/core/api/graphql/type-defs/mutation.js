import _ from 'lodash'

export default modules => {
  const typeMutations = modules.map(({ model }) => {
    const { modelName, gqlSchema, skipDefaultCRUDSchema } = model
    const defaultCRUDSchema = [
      `  create${modelName}(input: Create${modelName}Input!): Create${modelName}Payload`,
      `  update${modelName}(input: Update${modelName}Input!): Update${modelName}Payload`,
      `  update${modelName}ById(input: Update${modelName}ByIdInput!): Update${modelName}Payload`,
      `  delete${modelName}(input: Delete${modelName}Input!): Delete${modelName}Payload`,
      `  delete${modelName}ById(input: Delete${modelName}ByIdInput!): Delete${modelName}Payload`,
      `  delete${modelName}ByIds(input: Delete${modelName}ByIdsInput!): [Delete${modelName}Payload]`
    ]
    const strBuffer = []
    if (skipDefaultCRUDSchema !== true) {
      strBuffer.push(...defaultCRUDSchema)
    }
    if (!_.isEmpty(gqlSchema) && !_.isEmpty(gqlSchema.mutations)) {
      gqlSchema.mutations.forEach(({ typeDef }) => {
        if (typeDef) {
          strBuffer.push(`  ${typeDef}`)
        }
      })
    }
    return strBuffer.join('\n')
  })
  const rootMutations = [
    'type Mutation {',
    '  echo(message: String!): String!',
    ...typeMutations,
    '}\n'
  ]
  return rootMutations.join('\n')
}
