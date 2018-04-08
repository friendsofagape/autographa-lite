const merge = require("webpack-merge");
const jetpack = require("fs-jetpack");
const base = require("./webpack.base.config");

// Test files are scattered through the whole project. Here we're searching
// for them and generating entry file for webpack.

const e2eDir = jetpack.cwd("tests");
const tempDir = jetpack.cwd("temp");
const entryFilePath = tempDir.path("test.js");

const entryFileContent = e2eDir
  .find({ matching: "*.test.js" })
  .reduce((fileContent, path) => {
    const normalizedPath = path.replace(/\\/g, "/");
    return `${fileContent}import "../e2e/${normalizedPath}";\n`;
  }, "");

jetpack.write(entryFilePath, entryFileContent);

module.exports = env => {
  return merge(base(env), {
    entry: entryFilePath,
    output: {
      filename: "e2e.js",
      path: tempDir.path()
    }
  });
};
