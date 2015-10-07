var request = require("request"),
	cheerio = require("cheerio");

MY_EPISODES_URL = 'http://www.myepisodes.com';

var prompt = require('prompt');

var cookieJar = request.jar();

var scrap = function(user, pass) {
	var data = "username=" + user + "&password=" + pass + "&u=&action=Login";

	request({
	jar: cookieJar,
  	url: MY_EPISODES_URL + '/login.php',
    method: "POST",
	body: data,
	headers: {
      "Content-type": "application/x-www-form-urlencoded"
    }
}, function(err, res, body) {
		if(err) {
			callback.call(null, new Error('Login failed'));
			return;
		}

		console.log("Successfully logged on.");

		request({url: MY_EPISODES_URL + '/life_wasted.php', jar: cookieJar}, function(err, res, body) {
			if(err) {
				callback.call(null, new Error('Request failed'));
				return;
			}

			var $ = cheerio.load(body);
			var rows = $('.mylist').children().not('.header').each(function() {
				var row = $(this);
				var columns = $(row).children();
				var show = {
					title: $(columns[1]).text(),
					url: $(columns[1]).find('a').attr('href'),
					//episodes: []
				}
				console.log(show);
			}); // end each
		});
	});
}

console.log("Please enter username & password");

prompt.start();
prompt.get(['username', 'password'], function(err, result) {
	if(err) {
		console.log("Error reading username & password");
	}
	else {
		scrap(result.username, result.password);		
	}
});



	

