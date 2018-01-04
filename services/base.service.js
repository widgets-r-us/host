var ApiResponse = require('./api-response').ApiResponse
var BaseDao = require('../daos/base.dao')
var WidgetsRUsModel = require('@widgets-r-us/model')
var WidgetsRUsError = WidgetsRUsModel.WidgetsRUsError

let baseCreate = async function(model, validator) {
  if (validator) {
    let validation = validator.validate(model)
    if (validation !== 'pass') {
      console.log(validation)
      return new ApiResponse(400, new WidgetsRUsError({
        context: "BaseService#baseCreate",
        code: "model/create-invalid",
        message: JSON.stringify(validation),
        data: {input: {model: model, validator: validator}},
      }))
    }
  }

  let message = await BaseDao.createModel(model)
  if (message instanceof WidgetsRUsError) {
    if (message.code === "model/create-invalid")
      return new ApiResponse(400, message)
    else
      return new ApiResponse(500, message)
  } else {
    return new ApiResponse(201, message)
  }
}

let baseDeleteByWhereClause = async function(modelType, whereClause, validator) {
  let validation = validator.validateSubset(whereClause)
  if (validation !== 'pass')
    return new ApiResponse(400, new WidgetsRUsError({
      context: "BaseService#baseDeleteByWhereClause",
      code: "model/delete-invalid-where-clause",
      message: "The where clause wasn't valid as specified by the input validator",
      data: {e: e, input: {model: modelType, whereClause: whereClause, validator: validator}}
    }))

  let message = BaseDao.deleteModelByWhereClause(modelType, whereClause)
  if (message instanceof WidgetsRUsError) {
    if (message.code === "model/not-found")
      return new ApiResponse(404, message)
    else
      return new ApiResponse(500, message)
  } else {
    return new ApiResponse(204, {})
  }
}

let baseDeleteById = async function(modelType, modelId, validator) {
  return await baseDeleteByWhereClause(modelType, {_id: modelId}, validator)
}

exports.baseCreate = baseCreate
exports.baseDeleteById = baseDeleteById
exports.baseDeleteByWhereClause = baseDeleteByWhereClause