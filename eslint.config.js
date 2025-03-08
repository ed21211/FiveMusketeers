// eslint.config.js
module.exports = {
	overrides: [
	  {
		files: ["*.js"], // Target only .js files
		rules: {
		  semi: "error",
		  "prefer-const": "error"
		}
	  }
	]
  };