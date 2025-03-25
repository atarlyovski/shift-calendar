module.exports = {
  apps : [{
    name   : "a-shift-calendar",
    script : "./app.mjs",
    env    : {
      "NODE_ENV": "production",
      "PORT": 3275,
      "HTTPS_PORT": 3276
    }
  }]
}
