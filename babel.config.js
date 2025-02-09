module.exports = {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      ['next/babel']
    ],
    plugins: [
      '@babel/plugin-transform-runtime'
    ]
  };    