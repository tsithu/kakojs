import { createComplexityLimitRule } from 'graphql-validation-complexity'

export default ({ complexityLimit }) => createComplexityLimitRule(complexityLimit)
