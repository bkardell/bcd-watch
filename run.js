var fs = require('fs')
 
var result = `<!DOCTYPE HTML>
<html>
	<body>
		<h1>HELLO WORLD</h1>
	</body>
</html>`

fs.writeFileSync(
	'./out/index.html', result)
