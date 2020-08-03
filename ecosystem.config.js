module.exports = {
  apps : [{
    name: 'rari-fund-api-loanscan',
    script: 'index.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    // args: 'one two',
    // instances: 1,
    // autorestart: true,
    // watch: false,
    // max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      LOANSCAN_API_KEY: "tdoHuP0iGNpReGeQRyCb5ccBeCHmdMN8sV3FwM1i",
      DYDX_APRS_SAVE_PATH: __dirname + '/dydx-aprs.json'
    },
    env_production: {
      NODE_ENV: 'production',
      LOANSCAN_API_KEY: "tdoHuP0iGNpReGeQRyCb5ccBeCHmdMN8sV3FwM1i",
      DYDX_APRS_SAVE_PATH: __dirname + '/dydx-aprs.json'
    }
  }]
};
