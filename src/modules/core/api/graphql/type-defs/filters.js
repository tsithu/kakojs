import _ from 'lodash'

export default modules => {
  const subQueryFilterInput = [
    'input SubQueryFilterInput {',
    '  operator: String',
    '  table: String',
    '  column: String',
    ...modules.map(({ model }) => {
      const { skipDefaultCRUDSchema } = model
      return skipDefaultCRUDSchema !== true ? `${_.camelCase(model.modelName)}Filter: ${model.modelName}Filter` : null
    }),
    '}\n'
  ]
  const jsonFilterInput = [
    'input JsonFilterInput {',
    '  sq: SubQueryFilterInput',
    '  or: [StringFilterInput!]',
    '  and: [StringFilterInput!]',
    '  eq: String',
    '  iEq: String',
    '  ne: String',
    '  in: [String!]',
    '  notIn: [String!]',
    '  is: String',
    '  isNot: String',
    '  like: String',
    '  notLike: String',
    '  iLike: String',
    '  notILike: String',
    '}\n'
  ]
  const stringFilterInput = [
    'input StringFilterInput {',
    '  sq: SubQueryFilterInput',
    '  or: [StringFilterInput!]',
    '  and: [StringFilterInput!]',
    '  eq: String',
    '  iEq: String',
    '  ne: String',
    '  in: [String!]',
    '  notIn: [String!]',
    '  is: String',
    '  isNot: String',
    '  like: String',
    '  notLike: String',
    '  iLike: String',
    '  notILike: String',
    '}\n'
  ]
  const intFilterInput = [
    'input IntFilterInput {',
    '  sq: SubQueryFilterInput',
    '  or: [IntFilterInput!]',
    '  and: [IntFilterInput!]',
    '  eq: Int',
    '  ne: Int',
    '  in: [Int!]',
    '  notIn: [Int!]',
    '  gt: Int',
    '  gte: Int',
    '  lt: Int',
    '  lte: Int',
    '  is: Int',
    '  isNot: Int',
    '  between: [Int!]',
    '  notBetween: [Int!]',
    '}\n'
  ]
  const floatFilterInput = [
    'input FloatFilterInput {',
    '  sq: SubQueryFilterInput',
    '  or: [FloatFilterInput!]',
    '  and: [FloatFilterInput!]',
    '  eq: Float',
    '  ne: Float',
    '  in: [Float!]',
    '  notIn: [Float!]',
    '  gt: Float',
    '  gte: Float',
    '  lt: Float',
    '  lte: Float',
    '  is: Float',
    '  isNot: Float',
    '  between: [Float!]',
    '  notBetween: [Float!]',
    '}\n'
  ]
  const booleanFilterInput = [
    'input BooleanFilterInput {',
    '  sq: SubQueryFilterInput',
    '  or: [BooleanFilterInput!]',
    '  and: [BooleanFilterInput!]',
    '  eq: Boolean',
    '  ne: Boolean',
    '  is: Boolean',
    '  isNot: Boolean',
    '}\n'
  ]
  const timeFilterInput = [
    'input TimeFilterInput {',
    '  sq: SubQueryFilterInput',
    '  or: [TimeFilterInput!]',
    '  and: [TimeFilterInput!]',
    '  eq: Time',
    '  ne: Time',
    '  in: [Time!]',
    '  notIn: [Time!]',
    '  gt: Time',
    '  gte: Time',
    '  lt: Time',
    '  lte: Time',
    '  is: Time',
    '  isNot: Time',
    '  between: [Time!]',
    '  notBetween: [Time!]',
    '}\n'
  ]
  const dateFilterInput = [
    'input DateFilterInput {',
    '  sq: SubQueryFilterInput',
    '  or: [DateFilterInput!]',
    '  and: [DateFilterInput!]',
    '  eq: Date',
    '  ne: Date',
    '  in: [Date!]',
    '  notIn: [Date!]',
    '  gt: Date',
    '  gte: Date',
    '  lt: Date',
    '  lte: Date',
    '  is: Date',
    '  isNot: Date',
    '  between: [Date!]',
    '  notBetween: [Date!]',
    '}\n'
  ]
  const dateTimeFilterInput = [
    'input DateTimeFilterInput {',
    '  sq: SubQueryFilterInput',
    '  or: [DateTimeFilterInput!]',
    '  and: [DateTimeFilterInput!]',
    '  eq: DateTime',
    '  ne: DateTime',
    '  in: [DateTime!]',
    '  notIn: [DateTime!]',
    '  gt: DateTime',
    '  gte: DateTime',
    '  lt: DateTime',
    '  lte: DateTime',
    '  is: DateTime',
    '  isNot: DateTime',
    '  between: [DateTime!]',
    '  notBetween: [DateTime!]',
    '}\n'
  ]
  return [
    ...subQueryFilterInput,
    ...jsonFilterInput,
    ...stringFilterInput,
    ...intFilterInput,
    ...floatFilterInput,
    ...booleanFilterInput,
    ...timeFilterInput,
    ...dateFilterInput,
    ...dateTimeFilterInput
  ].join('\n')
}
