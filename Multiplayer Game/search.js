var fs = ('fs')
var logger = require("logmaker")
logger.enable()

module.exports = function (str) {
	if (str) {
		var results = [];
		var terms = str.split(/-| /)

		let dir = fs.readdirSync('./views/docs');
		let dirWords = ""

		for (let i in terms) {
			for (let j in dir) {
				dirWords = dir[i].split('-')
				for (let k in dirWords) {
					if (dirWords[k].indexOf(terms[i]) > -1) results.push(dir[j])
				}
			}
		}
		logger.log(results)
		return results
	}
}
