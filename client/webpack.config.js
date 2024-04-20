const path = require("path");

module.exports = {
    // Other webpack configurations...
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"], // Include TypeScript file extensions
        modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
};
