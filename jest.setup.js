var fs = require('fs')

require.extensions[".go"] = function(module, filename) {
  const content = fs.readFileSync(filename).toString("utf-8");
  console.log(content)
  module._compile(`
    exports.default = function(){ console.log("111")};
  `, filename);
};
