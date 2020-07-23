// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: ["@babel/plugin-proposal-private-property-in-object",
  "@babel/plugin-proposal-class-properties"
  ]

};