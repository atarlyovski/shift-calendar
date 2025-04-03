module.exports = {
  apps : [{
    name   : "a-shift-calendar",
    script : "./app.mjs",
    env    : {
      "NODE_ENV": "production",
      "PORT": 3275,
      "HTTPS_PORT": 3276,
      "ROUTER_IP": "192.168.6.1",
      "ROUTER_SSH_PORT": "15400",
      "ROUTER_USERNAME": "admin"
    }
  }]
}
