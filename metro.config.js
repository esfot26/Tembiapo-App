// const { getDefaultConfig } = require('expo/metro-config');
// const { withNativeWind } = require('nativewind/metro');

// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });


// funcionando pero sin nativewind
//metro.config.js 
// const { getDefaultConfig } = require("expo/metro-config");
// //const {withNatiwind}= require("nativewind/metro")
// // Obtenemos la configuración por defecto de Expo
// const config = getDefaultConfig(__dirname);

// module.exports = config;

// ;


// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require('nativewind/metro');
 
// const config = getDefaultConfig(__dirname)
 
// module.exports = withNativeWind(config, { input: './global.css' })

// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);




