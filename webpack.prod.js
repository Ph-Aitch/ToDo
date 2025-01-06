const path = require("path")
const common = require("./webpack.config")
const {merge} = require("webpack-merge")
const minicssextractplugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")

module.exports = merge(common,{
    mode: "production",
    entry: "./src/index.js",
    output: {
        filename: "main.[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    plugins: [ new minicssextractplugin({filename: "[name].[contenthash].css"})],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [minicssextractplugin.loader, "css-loader"],
            },
        ],
    },
    optimization: {
        minimize: true, 
        minimizer: [
            `...`,
            new CssMinimizerPlugin(), 
        ],
    },
});