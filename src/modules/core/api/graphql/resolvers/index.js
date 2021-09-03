import queryResolvers from './query-resolvers'
import mutationResolvers from './mutation-resolvers'
import subscriptionResolvers from './subscription-resolvers'
import modelResolvers from './model-resolvers'

export default modules => ({
  Query: queryResolvers(modules),
  Mutation: mutationResolvers(modules),
  Subscription: subscriptionResolvers(modules),
  ...modelResolvers(modules)
})
