import { gql } from 'apollo-server-koa'
import _ from 'lodash'
import directiveTypeDefs from '$/modules/core/api/graphql/directives/type-defs'
import query from './query'
import mutation from './mutation'
import subscription from './subscription'
import filters from './filters'
import dbFields from './fields'

function commonScalarTypes () {
  const strBuffer = [
    'scalar Time',
    'scalar Date',
    'scalar DateTime',
    'scalar JSON'
    // 'scalar Upload'
  ]
  return strBuffer.join('\n')
}

function commonEnumTypes () {
  return ''
}

function interfaces () {
  const strBuffer = [
    '"""An object with a globally unique \'ID\'."""',
    'interface Node {',
    '  """',
    '  A globally unique identifier. Can be used in various places throughout the system to identify this single value.',
    '  """',
    '  nodeId: ID!',
    '}\n'
  ]
  return strBuffer.join('\n')
}

function customTypeDefs (modules) {
  return modules.map(({ model }) => {
    const { gqlSchema } = model
    const { typeDefs } = gqlSchema || {}
    return typeDefs ? [typeDefs].join('\n') : ''
  })
}

function typeConnection (modules) {
  return modules.map(({ model }) => {
    const { modelName, pluralModelName, skipDefaultCRUDSchema } = model
    if (skipDefaultCRUDSchema === true) return null
    const strBuffer = [
      `type ${pluralModelName}Connection {`,
      `  nodes: [${modelName}]!`,
      '  totalCount: Int',
      '}\n'
    ]
    return strBuffer.join('\n')
  })
}

function orderByEnums (modules) {
  return modules.map(({ model }) => {
    const { pluralModelName, fields, skipDefaultCRUDSchema } = model
    if (skipDefaultCRUDSchema === true) return null
    const fieldNames = fields.map(f => f.upperSnakeCaseName)
    const strBuffer = [
      `enum ${pluralModelName}OrderBy {`,
      '  NATURAL',
      ...fieldNames.map(fieldName => `  ${fieldName}_ASC\n  ${fieldName}_DESC`),
      '  PRIMARY_KEY_ASC',
      '  PRIMARY_KEY_DESC',
      '}\n'
    ]
    return strBuffer.join('\n')
  })
}

function inputs (modules) {
  return modules.map(({ model }) => {
    const {
      modelName, fields, idField, skipDefaultCRUDSchema
    } = model
    if (skipDefaultCRUDSchema === true) return ''
    const camelCaseModelName = _.camelCase(modelName)
    const idFieldDef = `  ${idField.name}: ${idField.gqlType}!`
    const strBuffer = [
      `input ${modelName}Filter {`,
      `  or: ${modelName}Filter`,
      `  orArray: [${modelName}Filter!]`,
      `  and: ${modelName}Filter`,
      `  andArray: [${modelName}Filter!]`,
      ...fields.map(f => `  ${f.name}: ${f.gqlFilterType}`),
      '}\n',
      `input ${modelName}Input {`,
      ...fields.map(f => `  ${f.isPk ? f.gqlFieldDef.replace('!', '') : f.gqlFieldDef}`),
      '}\n',
      `input ${modelName}Patch {`,
      ...fields.map(f => `  ${f.name}: ${f.gqlType}`),
      '}\n',
      `input Create${modelName}Input {`,
      '  clientMutationId: String',
      `  ${camelCaseModelName}: ${modelName}Input!`,
      '}\n',
      `input Update${modelName}Input {`,
      '  clientMutationId: String',
      '  nodeId: ID!',
      `  ${camelCaseModelName}Patch: ${modelName}Patch!`,
      '}\n',
      `input Update${modelName}ByIdInput {`,
      '  clientMutationId: String',
      `  ${camelCaseModelName}Patch: ${modelName}Patch!`,
      idFieldDef,
      '}\n',
      `input Delete${modelName}Input {`,
      '  clientMutationId: String',
      '  nodeId: ID!',
      '}\n',
      `input Delete${modelName}ByIdInput {`,
      '  clientMutationId: String',
      idFieldDef,
      '}\n',
      `input Delete${modelName}ByIdsInput {`,
      '  clientMutationId: String',
      `  ids: [${idField.gqlType}!]!`,
      '}\n'
    ]
    // console.log(strBuffer.join('\n'))
    return strBuffer.join('\n')
  })
}

function typePayloads (modules) {
  return modules.map(({ model }) => {
    const { modelName, skipDefaultCRUDSchema } = model
    if (skipDefaultCRUDSchema === true) return null
    const camelCaseModelName = _.camelCase(modelName)
    const strBuffer = [
      `type Create${modelName}Payload {`,
      '  clientMutationId: String',
      `  ${camelCaseModelName}: ${modelName}`,
      '  query: Query',
      '}\n',
      `type Update${modelName}Payload {`,
      '  clientMutationId: String',
      `  ${camelCaseModelName}: ${modelName}`,
      '  query: Query',
      '}\n',
      `type Delete${modelName}Payload {`,
      '  clientMutationId: String',
      `  ${camelCaseModelName}: ${modelName}`,
      `  deleted${modelName}Id: ID`,
      '  query: Query',
      '}\n'
    ]
    return strBuffer.join('\n')
  })
}

export default modules => {
  const strBuffer = [
    directiveTypeDefs,
    commonScalarTypes(),
    commonEnumTypes(),
    interfaces(),
    filters(modules),
    query(modules),
    mutation(modules),
    subscription(modules),
    ...dbFields(modules),
    ...customTypeDefs(modules),
    ...inputs(modules),
    ...orderByEnums(modules),
    ...typeConnection(modules),
    ...typePayloads(modules)
  ]

  return gql`${strBuffer.join('\n')}`
}
