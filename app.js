var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var index = require('./routes/index')
var api = require('./routes/api')

var app = express()
var bluebird = require('bluebird')
var mongoose = require('mongoose')
var databaseUrl = 'mongodb://localhost:27017/widgets-r-us'

// Database connection
mongoose.Promise = bluebird
mongoose.connect(databaseUrl, { useMongoClient: true })
  .then(() => { console.log(`Successfully connected to the mongodb database at url: ${databaseUrl}`)})
  .catch(() => { console.log(`Error connecting to database as url: ${databaseUrl}`) })


let initializeDatabase = async function () {
  var WidgetsRUsModel = require('@widgets-r-us/model')
  var WidgetService = require('./services/widgets.service')
  var Widget = WidgetsRUsModel.Widget
  var Product = WidgetsRUsModel.Product
  var WidgetCategory = WidgetsRUsModel.WidgetCategory
  var WidgetCategoryOption = WidgetsRUsModel.WidgetCategoryOption
  var WidgetAttribute = WidgetsRUsModel.WidgetAttribute
  var WidgetXWidgetAttribute = WidgetsRUsModel.WidgetXWidgetAttribute
  var WidgetXWidgetCategoryOption = WidgetsRUsModel.WidgetXWidgetCategoryOption

  let apiResponse = {}
  let rootCategory = await WidgetCategory.find({widgetCategoryName: 'reservedRootWidgetCategory'}).limit(1)
  if (rootCategory.length === 0) {
    let rootWidgetCategory = new WidgetCategory({widgetCategoryName: 'reservedRootWidgetCategory'})
    rootWidgetCategory.parentId = rootWidgetCategory._id
    rootWidgetCategory = await rootWidgetCategory.save()
    let sizeWidgetCategory = await new WidgetCategory({parentId: rootWidgetCategory._id, widgetCategoryName: 'Size'}).save()
    let finishWidgetCategory = await new WidgetCategory({
      parentId: rootWidgetCategory._id,
      widgetCategoryName: 'Finish'
    }).save()
    let typeWidgetCategory = await new WidgetCategory({parentId: rootWidgetCategory._id, widgetCategoryName: 'Type'}).save()

    let infinitesimalWidgetCategoryOption = await new WidgetCategoryOption({
      parentId: sizeWidgetCategory._id,
      widgetCategoryOptionName: 'Infinitesimal'
    }).save()
    let woodWidgetCategoryOption = await new WidgetCategoryOption({
      parentId: finishWidgetCategory._id,
      widgetCategoryOptionName: 'Wood'
    }).save()
    let chromeWidgetCategoryOption = await new WidgetCategoryOption({
      parentId: finishWidgetCategory._id,
      widgetCategoryOptionName: 'Chrome'
    }).save()
    let diabolicalWidgetCategoryOption = await new WidgetCategoryOption({
      parentId: typeWidgetCategory._id,
      widgetCategoryOptionName: 'Diabolical'
    }).save()

    let hauntedAttribute = await new WidgetAttribute({widgetAttributeName: 'Haunted'}).save()
    let quitePleasant = await new WidgetAttribute({widgetAttributeName: 'Quite pleasant'}).save()

    let babysFirstWidget = new Widget({widgetName: "Baby's first widget"})
    let babysFirstProduct = new Product({
      merchandiseId: babysFirstWidget._id,
      productName: "Baby's first widget",
      quantity: 100,
      price: 50
    })

    apiResponse = await WidgetService.createWidget(babysFirstWidget,
        true,
        babysFirstProduct,
        [quitePleasant],
        [infinitesimalWidgetCategoryOption, woodWidgetCategoryOption, diabolicalWidgetCategoryOption]
    )
  }

  return apiResponse
}

initializeDatabase().then((res) => {console.log(res)}, (err) => {console.log(err)})

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  next()
})

app.use('/', index)
app.use('/api', api)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
