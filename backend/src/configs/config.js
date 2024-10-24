// config.js
let config;

if (process.env.NODE_ENV !== 'production') {
  config = require('./config.dev.js').default;
} else {
  config = require('./config.prod.js').default;
}

export default config;