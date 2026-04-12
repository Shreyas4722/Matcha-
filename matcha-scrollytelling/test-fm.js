const { transform } = require('framer-motion');
const t = transform([0, 0.3], [0, 1]);
console.log(t(1));
