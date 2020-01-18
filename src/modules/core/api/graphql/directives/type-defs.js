export default `
  directive @skip(if: Boolean!) on FIELD_DEFINITION
  directive @deprecated(reason: String = "No longer supported") on FIELD_DEFINITION | ENUM_VALUE
  directive @authenticated on OBJECT | FIELD_DEFINITION

  directive @upper on FIELD_DEFINITION
  directive @lower on FIELD_DEFINITION
`
