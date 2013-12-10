var db = require('../utilities/database');

exports.rootcategories = function(req,res){
	db.client.query('select * from category where parent_id is null',  function(err,results){
		if(err){
			console.log(err);
			res.send(401);
		}
		else{
			console.log(results.rows);
			var content = {'data':results.rows};
			  res.json(content);
		};
	});
}

exports.childscategories = function(req,res){
	console.log(req.query.category_id);
	db.client.query('select * from category where parent_id = '+ req.query.category_id,  function(err,results){
		if(err){
			console.log(err);
			res.send(401);
		}
		else{
			console.log(results.rows);
			var content = {'data':results.rows};
			
			res.json(content);
		};
	});
}


//get product by category
exports.category = function(req,res){
	db.client.query('SELECT * FROM product WHERE category_id = ' + req.query.category_id, function(err,results){
		if(err){
			console.log(err);
			res.send(401);
		}
		else{
			console.log(results.rows);
			var content = {'data':results.rows};
			  res.json(content);
		};
	});
};