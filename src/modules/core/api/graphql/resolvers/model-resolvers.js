import uniqid from 'uniqid'

export default modules => {
  const resolvers = {
    Node: {
      // eslint-disable-next-line
      __resolveType (obj) { // context, info
        // console.log('__resolveType::', obj)
        return ''
      }
    }
  }
  const resolverMap = modules.map(ctrl => {
    const { model } = ctrl
    const { modelName, relationMappings, skipDefaultCRUDSchema } = model
    const subResolvers = {}
    Object.keys(relationMappings).forEach(key => {
      subResolvers[key.toString()] = relationMappings[key.toString()].resolver
    })
    return skipDefaultCRUDSchema !== true ? {
      [modelName]: {
        nodeId: () => uniqid(),
        ...subResolvers
      }
    } : null
  })
  resolverMap.forEach(r => { Object.assign(resolvers, r) })
  return resolvers
}
