var fs = require('fs')
var runAt = new Date().toUTCString()
var result = `<!DOCTYPE HTML>
<html>
	<body>
		<h1>Last Run at ${runAt}</h1>
	</body>
</html>`

fs.writeFileSync(
	'./out/index.html', result)
