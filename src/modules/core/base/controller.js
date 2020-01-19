import _ from 'lodash'
import pluralize from 'pluralize'
import DataLoader from 'dataloader'
import { raw } from 'objection'
import loadServices from '$/services'

const opMap = {
  eq: '=',
  ne: '<>',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  isNot: 'is not',
  notIn: 'not in'
}

function getOperatorAndValue (obj) {
  const opAndValArray = Object.entries(obj)[0]
  const operator = opMap[opAndValArray[0]] ? opMap[opAndValArray[0]] : opAndValArray[0]
  const value = opAndValArray[1]
  // console.log(operator, value)
  return { operator, value }
}
export default class BaseController {
  constructor(model, config, services) {
    this.model = model
    this.config = config
    this.services = loadServices(config, services)
  }

  appendQuery (query, filter, logicalOP = 'and') {
    if (!_.isEmpty(filter)) {
      Object.entries(filter).forEach(([column, opAndVal]) => {
        if (column === 'or' || column === 'and') {
          query[`${column}Where`](builder => this.appendQuery(builder, opAndVal, column))
        } else if (column === 'orArray' || column === 'andArray') {
          if (_.isArray(opAndVal) && !_.isEmpty(opAndVal)) {
            const lop = column.replace('Array', '')
            query[`${lop}Where`](builder => {
              opAndVal.forEach(f => {
                builder[`${lop}Where`](innerBuilder => {
                  this.appendQuery(innerBuilder, f, lop)
                })
              })
            })
          }
        } else if (!_.isEmpty(opAndVal)) {
          const { operator, value } = getOperatorAndValue(opAndVal)
          if (operator && !_.isUndefined(value)) {
            if (operator === 'or' || operator === 'and') {
              if (_.isArray(value) && !_.isEmpty(value)) {
                value.forEach(val => {
                  const innerOpAndVal = getOperatorAndValue(val)
                  query[`${operator}Where`](column, innerOpAndVal.operator, innerOpAndVal.value)
                })
              }
            } else if (operator === 'sq') {
              const op = value.operator ? opMap[value.operator] || value.operator : '='
              const sqCol = value.column || 'id'
              const filters = Object.keys(value).filter(f => f.endsWith('Filter'))
              const sqFilter = !_.isEmpty(filters) ? filters[0] : null
              if (sqFilter) {
                const sqTable = value.table || (() => pluralize.plural(sqFilter.replace('Filter', '')))()
                query[`${logicalOP}Where`](column, op, builder => {
                  builder.select(sqCol).from(sqTable).where(sqBuilder => {
                    this.appendQuery(sqBuilder, value[sqFilter.toString()])
                  })
                })
              }
            } else if (operator === 'iEq') {
              query[`${logicalOP}Where`](raw(`lower("${_.snakeCase(column)}") = lower(?)`, value))
            } else {
              query[`${logicalOP}Where`](column, operator, value)
            }
          }
        }
      })
    }
  }

  appendOrderBy (query, orderBy) {
    if (orderBy && orderBy.length > 0) {
      const { idColumn } = this.model
      orderBy.map(ob => ob
        .toLowerCase()
        .replace('primary_key', idColumn)
        .replace('_asc', ' asc')
        .replace('_desc', ' desc')
        .split(' '))
        .forEach(ob => query.orderBy(...ob))
    }
  }

  async index (first, offset, orderBy, filter) {
    return this.find(first, offset, orderBy, filter)
  }

  async find (first, offset, orderBy, filter, from) {
    const { paginate } = this.config
    const { defaultPageSize, maxPageSize } = paginate
    const pageSize = (first > maxPageSize ? maxPageSize : first) || defaultPageSize
    const page = (offset || 0) / pageSize
    const query = this.model.query()
    if (from) {
      query.from(from)
    }
    this.appendQuery(query, filter)
    this.appendOrderBy(query, orderBy)
    return query.page(page, pageSize)
  }

  async findOne (filter, orderBy) {
    if (filter) {
      const query = this.model.query()
      this.appendQuery(query, filter)
      this.appendOrderBy(query, orderBy)
      return query.first()
    }
    return null
  }

  async findFirst (filter, orderBy) {
    return this.findOne(filter, orderBy)
  }

  async findLast (filter, orderBy = ['primary_key_asc']) {
    return this.findOne(filter, orderBy
      .map(o => (o.endsWith('asc') ? o.replace('asc', 'desc') : o.replace('desc', 'asc'))))
  }

  async findById (id) {
    return this.model.query().where({ id }).first()
  }

  async findByIds (ids) {
    const { idColumn } = this.model
    return this.model.query().where(idColumn, 'in', ids)
  }

  async createNew (data) {
    return this.model.query().insertGraph(data)
      .returning('*')
      .first()
  }

  async updateById (id, data) {
    const { idColumn } = this.model
    return this.model.query().update(data)
      .where(idColumn, id)
      .returning('*')
      .first()
  }

  async updateByIds (ids, data) {
    const { idColumn } = this.model
    return this.model.query().update(data)
      .where(idColumn, 'in', ids)
  }

  async updateByFilter (filter, data) {
    const query = this.model.query()
    this.appendQuery(query, filter)
    return query.update(data)
  }

  async patchById (id, data) {
    const { idColumn } = this.model
    return this.model.query().patch(data)
      .where(idColumn, id)
      .returning('*')
      .first()
  }

  async patchByIds (ids, data) {
    const { idColumn } = this.model
    return this.model.query().patch(data)
      .where(idColumn, 'in', ids)
  }

  async patchByFilter (filter, data) {
    const query = this.model.query()
    this.appendQuery(query, filter)
    return query.patch(data)
  }

  async deleteById (id) {
    return this.model.query().deleteById(id)
      .returning('*')
      .first()
  }

  async deleteByIds (ids) {
    const { idColumn } = this.model
    return this.model.query().delete()
      .where(idColumn, 'in', ids)
      .returning('*')
  }

  async deleteByFilter (filter) {
    const query = this.model.query()
    this.appendQuery(query, filter)
    return query.delete()
  }
  // Below is GraphQl Related

  get loaderName () {
    const { modelName } = this.model
    return `${_.camelCase(modelName)}Loader`
  }

  get loader () {
    return {
      byID: new DataLoader(async ids => {
        const { idColumn } = this.model
        const records = await this.findByIds(ids)
        const recordsById = _.keyBy(records, idColumn)
        return ids.map(recordId => recordsById[recordId.toString()])
      })
    }
  }
}
