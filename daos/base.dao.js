var ApiResponse = require('../services/api-response').ApiResponse
var WidgetsRUsModel = require('@widgets-r-us/model')
var WidgetsRUsError = WidgetsRUsModel.WidgetsRUsError

let createModel = async function(modelType, model) {
  try {
    return await model.save()
  } catch(e) {
    return new WidgetsRUsError({
      context: "BaseDao#createModel",
      code: "model/create",
      message: "There was an error saving the model",
      data: {e: e, input: {model: model}},
    })
  }
}

let readById = async function(modelType, id, isLean) {
  try {
    let result = await modelType.findById(id).lean(isLean)
    if (result.length > 0)
      return result
    else
      return new WidgetsRUsError({
        context: "BaseDao#readById",
        code: "model/not-found",
        message: "There was an error while reading the specified model",
        data: {e: e, input: {modelType: modelType, modelId: id, lean: isLean}},
      })
  } catch(e) {
    return new WidgetsRUsError({
      context: "BaseDao#readById",
      code: "model/read",
      message: "There was an error while reading the specified model",
      data: {e: e, input: {modelType: modelType, modelId: id, lean: isLean}},
    })
  }
}

let deleteModelByWhereClause = async function(modelType, whereClause) {
  try {
    let deletedModel = await modelType.where(whereClause).findOneAndRemove()
    if (deletedModel._id)
      return deletedModel
    else
      return new WidgetsRUsError({
        context: "BaseDao#deleteModelWithId",
        code: "model/not-found",
        message: "The specified model does not exist.",
        data: {e: e, input: {model: modelType, id: id}},
      })
  } catch (e) {
    return new WidgetsRUsError({
      context: "BaseDao#deleteModelWithId",
      code: "model/delete",
      message: "There was an error while deleting the specified model",
      data: {e: e, input: {model: modelType, id: id}},
    })
  }
}

exports.createModel = createModel
exports.readById = readById
exports.deleteModelByWhereClause = deleteModelByWhereClause
