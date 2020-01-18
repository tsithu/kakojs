import depthLimit from 'graphql-depth-limit'

export default ({ maxDepth, options }) => depthLimit(maxDepth, options)
