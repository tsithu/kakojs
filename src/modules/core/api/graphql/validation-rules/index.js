
import depthLimit from './depth-limit'
import queryComplexity from './query-complexity'
import validationComplexity from './validation-complexity'

export default ({ graphql }) => {
  if (graphql) {
    const rules = []
    if (graphql.depthLimit) rules.push(depthLimit(graphql.depthLimit))
    if (graphql.queryComplexity) rules.push(queryComplexity(graphql.queryComplexity))
    if (graphql.validationComplexity) rules.push(validationComplexity(graphql.validationComplexity))
    return rules
  }
  return null
}
