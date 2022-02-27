module.exports = {
	presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
	plugins: [
		"@babel/plugin-transform-typescript",
		"@babel/plugin-proposal-export-namespace-from"
	]	
};
