const path = require("path");
const webpack = require("webpack");
const { execSync } = require("child_process");

// Short commit hash of HEAD, with "+" when there are uncommitted changes.
const gitVersion = (() => {
  try {
    const hash = execSync("git rev-parse --short HEAD").toString().trim();
    const dirty = execSync("git status --porcelain").toString().trim();
    return dirty ? hash + "+" : hash;
  } catch (e) {
    return "unknown";
  }
})();

module.exports = {
  target: "node",
  entry: "./src/pime.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, "src")],
        exclude: [
          path.resolve(__dirname, "src/index.ts"),
          path.resolve(__dirname, "src/chromeos_ime.ts"),
          path.resolve(__dirname, "src/mcp.ts"),
          path.resolve(__dirname, "src/LargeSync/LargeSync.ts"),
        ],
        use: "ts-loader",
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({ GIT_VERSION: JSON.stringify(gitVersion) }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "index.js",
    library: "mcbopomofo",
    libraryTarget: "umd",
    globalObject: "this",
    path: path.resolve(__dirname, "output/pime"),
  },
};
