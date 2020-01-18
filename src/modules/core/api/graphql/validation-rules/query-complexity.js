import queryComplexity, {
  fieldConfigEstimator,
  simpleEstimator
} from 'graphql-query-complexity'

export default options => queryComplexity({
  ...options,
  ...(Object.keys(options).includes('estimators')
    ? null
    : {
      estimators: [
        fieldConfigEstimator(),
        simpleEstimator({
          defaultComplexity: 1
        })
      ]
    }
  )
})
