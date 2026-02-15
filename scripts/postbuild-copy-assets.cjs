const fs = require('fs');
const path = require('path');

const srcPng = path.resolve(__dirname, '..', 'logo-full-256x.png');
const dstDir = path.resolve(__dirname, '..', 'dist', 'nodes', 'GaiusLex');
const dstPng = path.join(dstDir, 'logo-full-256x.png');

try {
	if (!fs.existsSync(srcPng)) {
		process.exit(0);
	}
	fs.mkdirSync(dstDir, { recursive: true });
	fs.copyFileSync(srcPng, dstPng);
	process.exit(0);
} catch (e) {
	console.error(e);
	process.exit(1);
}

