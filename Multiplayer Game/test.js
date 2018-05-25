	var query = "install";
	var PythonShell = require('python-shell');
	var pyshell = new PythonShell('scan.py');

	pyshell.send(query);

	pyshell.on('message', function (message) {
		console.log(message);
	  	pyshell.end(function (err, code, signal) {
	  	  if (err) throw err;
	  	});

		return message;
	});