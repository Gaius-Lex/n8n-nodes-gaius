const fs = require('fs');
const path = require('path');

const srcSvg = path.resolve(__dirname, '..', 'nodes', 'GaiusLex', 'gaiuslex.svg');
const dstDir = path.resolve(__dirname, '..', 'dist', 'nodes', 'GaiusLex');
const dstSvg = path.join(dstDir, 'gaiuslex.svg');

try {
	fs.mkdirSync(dstDir, { recursive: true });
	if (fs.existsSync(srcSvg)) {
		fs.copyFileSync(srcSvg, dstSvg);
	}
	process.exit(0);
} catch (e) {
	console.error(e);
	process.exit(1);
}
