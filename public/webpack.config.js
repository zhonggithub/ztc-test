/*
 * @Author: CC
 * @Date:   2016-01-06 10:52:40
 * @Last Modified by:   Hedgehog
 * @Last Modified time: 2016-04-05 11:44:34
 */
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        'admin/index': './src/modules/admin/index',
    },
    output: {
        path: './dist/',
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: "[id].[hash].js",
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        root: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, './src/components'),
            path.resolve(__dirname, './src/modules'),
        ],
        alias: {},
    },
    externals: {},
    module: {
        // noParse: [/moment-with-locales/],
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            // query: {
            //     cacheDirectory: true
            // },
        }, {
            test: /\.vue$/,
            loader: 'vue',
        }, {
            test: /\.css$/,
            loader: 'style!css',
        }, {
            test: /\.less$/,
            loader: 'style!css!less',
        }, {
            test: /\.scss/,
            loader: 'style!css!scss',
        }, {
            test: /\.(png|gif|jpe?g)$/,
            loader: 'file-loader?name=./images/[hash].[ext]',
        }, {
            test: /\.html$/,
            loader: 'html',
        }, {
            test: /\.json$/,
            loader: 'json',
        }, {
            test: /\.(woff|woff2|eot|ttf|svg)(\?.*)?$/,
            loader: "file-loader?name=./fonts/[hash].[ext]"
        }],
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEBUG__: process.env.NODE_ENV !== 'production',
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
            "require.specified": "require.resolve"
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
            'CodeMirror': 'codemirror',
            'window.CodeMirror': 'codemirror',
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            minimize: true,
            compress: {
                warnings: false,
                drop_console: true,
            },
        }),
        new webpack.NoErrorsPlugin(),
    ],
    babel: {
        presets: ['es2015'],
    },
    vue: {
        loaders: {
            js: 'babel',
        },
    },
};
if (process.env.NODE_ENV !== 'production') {
    module.exports.output.filename = '[name].js';
} else {
    module.exports.plugins.push(new CleanWebpackPlugin(['dist'], {
        root: path.resolve(__dirname),
        verbose: true,
        dry: false
    }));
    // module.exports.output.publicPath = 'http://res.wifi.utuapp.cn/dist/';
}
