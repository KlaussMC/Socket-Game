'use strict';
let express = require('express');
let router = express.Router();
let fs = require("fs")

let socket = require("./socket")
let db = require("krakendb")
db.loaddb("comments");

let title = "Duel.io"

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title, imgAmnt:(fs.readdirSync("./public/res/screenshots").length)}); //(err, files) => { return files.length}, function (err, files) { return files.length }
});
router.get('/game', function (req, res) {
  res.render('game', { title, port: socket.socketPort });
})
router.get('/about', function (req, res) {
  res.render('about', { title })
})
router.get('/notes', function (req, res) {
  res.render('notes', { title, input: getComments() })
})
router.post('/notes', function (req, res) {
  console.log('new comment')
  let data = [`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`, req.body.note]

  db.push("comment" + db.length(), data)
  db.exportdb()

  res.render('notes', { title: title, input: getComments() })
})

function getComments() {
  let comments = [];
  for (let i = 0; i < db.length(); i++) {
    let tmp = db.getByIndex(i)
    if (Array.isArray(tmp)) {
      comments.push(tmp)
    }
  }

  return comments;
}

//docs

router.get('/docs', function (req, res) {
  res.render('docs/main', { title })
})

router.get('/docs/:page', function (req, res) {
	if (req.params.page != "search") {
		if (req.params.page == "index") {
			function getPages() {
				var res = []
				var pages = fs.readdirSync('views/docs')
				var blacklist = ["desktop.ini", "search.pug", "layout.pug", "list.pug"]

				for (var i = 0; i < pages.length; i++) {
					if (blacklist.indexOf(pages[i]) == -1) {
						res.push(pages[i].slice(0, -4))
					}
				}
				return res
			}
			res.render('docs/list', { title, pages: getPages() })
		} else {
			res.render('docs/' + req.params.page, { title })
		}
	} else {
		try {
			var query = req.query.query
			var results = search(query)
			var type = typeof results;

			function search(query) {
				var spawn = require("child_process").spawn;
				var pythonProcess = spawn('python',["./scan.py", query]);

				pythonProcess.stdout.on('data', function (data) {
					var results = data.toString('utf8').trim().split(",")
					res.render('docs/search', { title, results })
				});
			}
		} catch (e) {
			res.render("error", {
		        message: "A really wierd error occured",
		        error: e
		    })
		}
	}
})

module.exports = router;
