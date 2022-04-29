/* webpack打包配置文件 */
const path = require('path')
const glob = require('glob')

/* 插件 */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

/* 自动加载所有页面的js 作为入口 */
const files = glob.sync('./src/pages/*/*.js')
const entry = {}
files.forEach(function (key) {
    entry[path.basename(key).replace('.js', '')] = key
})

/* 自动打包页面 */
const htmls = glob.sync('./src/pages/*/*.html')
const r = htmls.map(function (html) {
    let name = path.basename(html)
    return new HtmlWebpackPlugin({
        template: html, // 模板页面
        filename: name, // 打包过后输出的页面名字
        chunks: [name.replace('.html', '')],
    })
})

// 把打包配置暴露出去
module.exports = {
    // 多入口
    entry: entry,

    // 插件
    plugins: [
        // 删除dist
        new CleanWebpackPlugin(),
        // 提取css插件
        new MiniCssExtractPlugin({
            filename: './css/[name].css'
        }),
        // 压缩css插件
        new OptimizeCssAssetsWebpackPlugin()
    ].concat(r),

    // 出口
    output: {
        path: path.resolve(__dirname, 'dist'), // 打包过后 输出到哪里目录
        filename: 'js/[name].js', // 打包过后的文件名
        publicPath: './'  // 查找静态资源的公共路径前缀
    },

    // 加载器
    module: {
        // 加载器处理规则
        rules: [
            // 打包css
            {
                test: /\.css$/,  // 要处理的文件类型
                // use: ['style-loader', 'css-loader'], // 加载器
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../'
                    }
                }, 'css-loader'], // 加载器
            },

            // 打包less
            {
                test: /\.less$/,  // 要处理的文件类型
                // use: ['style-loader', 'css-loader', 'less-loader'], // 加载器
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../'
                    }
                }, 'css-loader', 'less-loader'], // 加载器
            },

            // 打包css背景图
            {
                test: /\.(png|jpg|gif|jpeg|webp)$/,  // 要处理的文件类型
                // use: ['url-loader'], // 加载器
                loader: 'url-loader',
                options: { // 自定义配置
                    limit: 10 * 1024, // 限制大小 10kb
                    name: '[hash:16].[ext]', // 控制名字长度 
                    esModule: false, // 关闭es6模块化
                    outputPath: 'imgs', // 输出目录
                }
            },

            // 打包html中的图片
            {
                test: /\.html$/,  // 要处理的文件类型
                loader: 'html-loader', // 加载器
            },

            // 打包html中的图片
            {
                test: /\.(woff|ttf|woff2|svg|eot)$/,  // 要处理的文件类型
                loader: 'file-loader', // 加载器
                options: {
                    name: '[hash:16].[ext]', // 控制名字长度
                    outputPath: 'fonts'
                }
            },
        ]
    },

    // 模式
    mode: process.env.NODE_ENV,

    // 开发服务器
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'), // 启动服务器目录
        compress: true, // 启动gzip
        port: 8080,  // 端口
        open: true, // 自动打开服务
        publicPath: '/', // 静态资源查找路径
        openPage: 'ad.html', // 打开的页面
    },
    target: 'web', // 目标是浏览器
}