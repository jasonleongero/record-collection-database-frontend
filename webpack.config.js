const path = require("path");
const EventHooksPlugin = require('event-hooks-webpack-plugin');
const PostCompile = require('post-compile-webpack-plugin');
const fs = require("fs");
const yaml = require('js-yaml');

const bundleFile = "./dist/bundle.js";

class ConfigUtils {
    constructor(environment, bundleFile) {
        this.bundleFile = bundleFile;
        this.environment = environment;
    }
    
    loadConfigurationObject() {
        if (this.config === undefined) {
            this.config = yaml.safeLoad(fs.readFileSync(`./config/${this.environment}.yml`, 'utf8'));
        }
    }
    
    getServiceHost() {
        this.loadConfigurationObject();
        
        return this.config.serviceHost;
    }
    
    makeConfigReplacements(replacements) {
        let fileContents = fs.readFileSync(this.bundleFile, {encoding: "utf-8"});
        
        for (const [placeholder, replacement] of replacements) {
            fileContents = fileContents.replace(placeholder, replacement);
        }
        
        fs.writeFileSync(this.bundleFile, fileContents, {encoding: "utf-8"});
    }
}

module.exports = env => ({
    entry: "./src/main.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        modules: [
            "node_modules"
        ],
        extensions: [".ts", ".js", ".html"]
    },
    plugins: [
        new PostCompile(() => {
            env = env || {ENVIRONMENT: "dev"};
            
            const configUtils = new ConfigUtils(env.ENVIRONMENT, bundleFile);
            const serviceHost = configUtils.getServiceHost();
                        
            const replacements = [
                ["%%BACKEND_SERVICE_HOST%%", serviceHost]
            ];
            
            configUtils.makeConfigReplacements(replacements);
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ["ts-loader", "angular2-template-loader"]
            },
            {
                test: /\.html$/,
                loader: "raw-loader"
            },
            {
                test: /^(?!.*global-styles).*\.scss$/,
                loaders: ["to-string-loader", "css-loader", "sass-loader"]
            },
            {
                test: /global-styles\.scss/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            },
            {
                test: /images.*\.(png|svg|jpg|ico|gif)/,
                loader: 'file-loader?name=[name].[ext]&publicPath=dist/&outputPath=images/'
            }
        ]
    }
});