// Runs the example against the library's source in ../src, so edits to the
// library show up immediately without a build step.
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const libraryRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [libraryRoot];

config.resolver.extraNodeModules = {
  "@ladiyusuph/responsive-rn": path.join(libraryRoot, "src"),
};

// The library root has its own dev copies of react and react-native, and
// bundling two Reacts breaks hooks. Hide the root's node_modules from Metro
// so imports inside ../src fall through to the example's node_modules.
config.resolver.nodeModulesPaths = [path.join(projectRoot, "node_modules")];
config.resolver.blockList = [
  new RegExp(`^${escapeRegExp(path.join(libraryRoot, "node_modules"))}\\/.*$`),
  new RegExp(`^${escapeRegExp(path.join(libraryRoot, "dist"))}\\/.*$`),
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = config;
