module.exports = {
  extends: ["airbnb-typescript-prettier"],
  rules:{
  	"@typescript-eslint/camelcase": "off",
  	"no-underscore-dangle":["off",{ "enforceInMethodNames": true }],
  	"no-shadow": [0, { "builtinGlobals": false, "hoist": "functions", "allow": [] }]
  }
};