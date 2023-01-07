/* eslint-disable no-unused-vars */
import _ from 'lodash'

export default modules => {
  const typeSubscriptions = modules.map(({ model }) => {
    const {
      modelName, gqlSchema, skipDefaultCRUDSchema, idField
    } = model
    const camelCaseModelName = _.camelCase(modelName)
    const { name, gqlTypeWithStatus } = idField || {}
    const defaultCRUDSchema = skipDefaultCRUDSchema === true ? [] : [
      `  ${camelCaseModelName}Created: ${modelName}`,
      `  ${camelCaseModelName}Updated(${name}: ${gqlTypeWithStatus}): ${modelName}`,
      `  ${camelCaseModelName}Deleted(${name}: ${gqlTypeWithStatus}): ${modelName}`
    ]
    const strBuffer = []
    strBuffer.push(...defaultCRUDSchema)
    if (!_.isEmpty(gqlSchema) && !_.isEmpty(gqlSchema.subscriptions)) {
      gqlSchema.subscriptions.forEach(({ typeDef }) => {
        if (typeDef) {
          strBuffer.push(`  ${typeDef}`)
        }
      })
    }
    return strBuffer.join('\n')
  })
  const rootSubscriptions = [
    'type Subscription {',
    '  echo: String!',
    ...typeSubscriptions,
    '}\n'
  ]
  return rootSubscriptions.join('\n')
}
