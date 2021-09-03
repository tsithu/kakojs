import _ from 'lodash'

export default modules => {
  const loaders = {}
  modules.forEach(({ model, loader }) => {
    loaders[`${_.camelCase(model.modelName)}Loader`] = loader
  })
  return loaders
}
