 const express = require('express')
 const app = express() //请求server
 const appData = require('./data')
 //加载本地数据文件,不能缺少./不然会报错。。。。至于是为什么？我没有找到解释的。。可能不加./会默认为是引入依赖，加./是引入文件？
 var seller = appData.seller; //获取对应的本地数据
 var goods = appData.goods
 var ratings = appData.ratings
 var apiRoutes = express.Router()
 app.use('/api', apiRoutes) //通过路由请求数据

 let path = require('path')

 function resolve(dir) {
     return path.join(__dirname, dir)
 }







 module.exports = {
     lintOnSave: false,
     publicPath: './',

     // 输出文件目录
     css: {
         sourceMap: true
     },
     outputDir: 'dist',
     devServer: {
         //模拟数据开始
         before(app) {
             app.get('/api/seller', function (req, res) { //定义接口；在路径中输入http://localhost:8080/api/seller就可以看到数据啦
                     res.json({
                         errno: 0, //数据正常； 业务方定的的错误码；
                         data: seller
                     });
                 }),

                 app.get('/api/goods', function (req, res) {
                     res.json({
                         errno: 0,
                         data: goods
                     });
                 }),

                 app.get('/api/ratings', function (req, res) {
                     res.json({
                         errno: 0,
                         data: ratings
                     });
                 })

         }
     },
     chainWebpack: config => {
         config.resolve.alias
             .set('@', resolve('src'))
             .set('component', resolve('src/components'))

     },

     // configureWebpack: {
     //     resolve: {
     //         extensions: ['.js', '.vue', '.json'],
     //         alias: {
     //             '@': resolve('src'),
     //             'component':resolve('src/components')

     //         }
     //     }
     // }

 }