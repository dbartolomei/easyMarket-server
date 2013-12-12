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
			console.log(content);	
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

exports.get_all_cat_products = function(req,res){
	console.log(req.query.category_id);
	db.client.query("SELECT * FROM product WHERE product.category_id in (select category_id from category where parent_id = " + req.query.category_id +")", function(err,results){
		if(err){
			console.log(err)
			res.send(401)
		}
		else{
			console.log(results.rows)
			var content = {'data':results.rows}
			res.json(content)
		}
	})
};

exports.search_query = function(req,res){
	console.log(req.query.category_id);
	db.client.query("select * from product where lower(product_name) LIKE lower('%"+req.query.search_query+"%') or lower(description) LIKE lower('%"+req.query.search_query+"%') or lower(brand) LIKE lower('%"+req.query.search_query+"%')", function(err,results){
		if(err){
			console.log(err)
			res.send(401)
		}
		else{
			console.log(results.rows)
			var content = {'data':results.rows}
			res.json(content)
		}
	})	
}

