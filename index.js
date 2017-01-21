var pg = require('pg');
var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost:5434/bulletin';//save in bashrc
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine' , 'ejs');
app.set('views', './views');

app.use(express.static('public'));

console.log(connectionString);
app.get('/', function(req,res){
	pg.connect(connectionString, function(err,client,done){
		client.query('select * from messages', function(err,result){

			if(err) return console.log(err);
			res.render('users', {data:result.rows});
			console.log(result.rows);
			done();
			pg.end();
		});
	});
});

app.get('/:id', function(req,res){

	pg.connect('postgres://postgres:123456@localhost:5434/bulletin', function(err,client,done){

		var user_id = req.params.id;//gets id from req object
		console.log(user_id);
		client.query(`select * from messages  where id = '${user_id}'`, function(err,result){

			res.render('show' , {user:result.rows[0]});//since there is only one result
			console.log(result.rows);
			done();
			pg.end();	
	
		});
		
	});

});

app.post('/', function(req,res){

	pg.connect('postgres://postgres:123456@localhost:5434/bulletin', function(err ,client, done){

		client.query(`insert into messages(title, body) values('${req.body.title}', '${req.body.blog}')`, function(err,result){

			console.log(err);
			res.redirect('/');
			done();
			pg.end();

		});
	});
});


app.listen(8000);
