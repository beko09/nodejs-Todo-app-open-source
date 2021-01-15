const env = process.env.NODE_ENV || "Development";
console.log("env --------", env);

if (env === "Development" || env === "Testing") {
    const config = require('./config.json');
    const envConfig = config[env];
    Object.keys(envConfig).forEach((key) => {
        process.env[key]= envConfig[key]
    })
}
