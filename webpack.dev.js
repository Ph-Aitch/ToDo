const path = require("path")
const common = require("./webpack.config")
const {merge} = require("webpack-merge")

module.exports = merge(common,{
    mode: "development",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    module:{
        rules:[
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
});