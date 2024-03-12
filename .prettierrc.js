// @ts-check
/** @type {import("@serverless-guru/prettier-plugin-import-order").PrettierConfig} */
module.exports = {
  printWidth: 100,
  semi: false,
  singleQuote: false,
  trailingComma: "all",
  // Sort and group imports using the @serverless-guru/prettier-import-order plugin.
  // https://github.com/serverless-guru/prettier-import-order
  //
  // See documentation and usage: https://www.npmjs.com/package/@serverless-guru/prettier-plugin-import-order#usage
  importOrder: [
    "^react(-native)?$", // React and react-native
    "", // use empty strings to separate groups with empty lines
    "<THIRD_PARTY_MODULES>", // Third party modules (this is a plugin keyword)
    "",
    "^src/(.*)$",
    "",
    "^../(.*)$", // Local imports in parent directories
    "^./(.*)$", // Local imports in current directory
  ],
  importOrderSeparation: false, // turn this on to see the sorting groups.
  importOrderSortIndividualImports: true,
  importOrderMergeDuplicateImports: true,
  importOrderTypeImportsToTop: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: ["typescript", "jsx"],
  // End sort options
}
