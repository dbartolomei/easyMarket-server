var db = require('../utilities/database');
var md5 = require('MD5');

//user login

exports.login = function(req, res){
	console.log(req)
	var auxPassword = md5(req.body.password);
	console.log(auxPassword);
	console.log(req.body.username);
	var query = 'select * from "user" where email = ' +"'"+req.body.username + "'";
	console.log(query);
	db.client.query(query, function(err,results){
		if(err){
			console.log(err);
			res.send(401);
		}
		else{
			if(results.rows[0].password == auxPassword){
				var content = {'data':results.rows[0]};
				delete content.data.password;
				console.log(content);
				res.json(content);
			}
			else{
				res.send(401);
			}
		};
	});
};

//get user credit cards
exports.getcc = function(req,res){
	var query = 'select * from creditcard where user_id = ' + req.query.id;
	console.log(query);
	db.client.query(query, function(err,results){
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


exports.allusers = function(req,res){
	var query = 'select * from "user"';
	console.log(query);
	db.client.query(query, function(err,results){
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



exports.getuser = function(req,res){
	console.log(req.query.user_id);
	var query = 'select * from "user" where user_id = ' + req.query.user_id;
	console.log(query);
	db.client.query(query, function(err,results){
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

//get user orders
exports.orders= function(req,res){
	var query= 'select product.product_id, product_name, brand, product.user_id as selling_user,transaction_date,transaction_id, quantity, temptable.price as price  from product inner join (select transaction_date,transaction_id, quantity, transaction.price, sell.sell_id, product_id   from transaction inner join sell on transaction.sell_id=sell.sell_id where transaction.user_id= '+ req.query.user_id +') as temptable on temptable.product_id=product.product_id';
		
	db.client.query(query ,  function(err,results){
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


//get products that user is selling 

exports.sellingproducts= function(req,res){
	var query= 'select product_id, product_name, description, brand, price, stock from product natural join sell where available is true and user_id='+ req.query.user_id ;
		
	db.client.query(query ,  function(err,results){
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

exports.auctionproducts= function(req,res){
		var query= 'select tempeve.product_id, product_name, description, brand,auction_price, end_time, bid_price, bid_date, bid_user, first_name, last_name from "user" inner join (select product.product_id, product_name, description, brand,auction_price, end_time, bid_price, bid_date, bid_user from product inner join (select product_id , auction.price as auction_price, end_time, bid.price as bid_price, bid_date, bid.user_id as bid_user , available from auction inner join bid on auction.auction_id=bid.auction_id where available is true) as temp on temp.product_id=product.product_id where available is true and product.user_id= '+ req.query.user_id +'order by product.product_id,bid_date desc) as tempeve on tempeve.bid_user= "user".user_id';
		db.client.query(query,  function(err,results){
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

//get product that the user is biding

exports.winningbids= function(req,res){
	var query ='select product.product_id, product_name, bid_date, temp.price, end_time from product inner join (select product_id,highbid.price,bid_date, end_time from ( select * from bid where user_id='+ req.query.user_id +' and bid_date=(select max(bid_date) from bid as bidtemp where bidtemp.auction_id= bid.auction_id)) as highbid inner join auction on highbid.auction_id=auction.auction_id where available is true ) as temp on temp.product_id=product.product_id';
	db.client.query(query ,  function(err,results){
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
exports.losingbids= function(req,res){
	var query='select product.product_id, product_name, bid_date, temp.price, end_time from product inner join (select product_id,highbid.price,bid_date, end_time from ( select * from bid where user_id='+ req.query.user_id + ' and bid_date!=(select max(bid_date) from bid as bidtemp where bidtemp.auction_id= bid.auction_id)) as highbid inner join auction on highbid.auction_id=auction.auction_id where available is true ) as temp on temp.product_id=product.product_id';
		
	db.client.query(query ,  function(err,results){
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
//products in your cart
exports.cartproducts = function(req, res){
	var query='select * from product natural join (select sell.sell_id,sell.price, product_id, price_total from sell inner join (select * from cart natural join putincart where active is true and user_id='+req.query.user_id +') as temptable on sell.sell_id=temptable.sell_id) as temptable2';
	db.client.query(query, function(err,results){
		if(err){
			console.log(err);
			res.send(401);
		}
		else{
			console.log(results.rows);
			var content = {'data':results.rows};
			res.json(content);
		}
	});
};
exports.loginadmin= function(req, res){

	var auxPassword = md5(req.body.password);
	console.log(auxPassword);
	console.log(req.body.username);
	var query = 'select * from administrator where email = ' +"'"+req.body.username + "'";
	console.log(query);
	db.client.query(query, function(err,results){
		if(err){
			console.log(err);
			res.send(401);
		}
		else{
			if(results.rows[0].password == auxPassword){
				var content = {'data':results.rows[0]};
				delete content.data.password;
				console.log(content);
				res.json(content);
			}
			else{
				res.send(401);
			}
		};
	});
};
//get user creditcards
exports.creditcard= function(req,res){
	var query='select * from address inner join (select * from creditcard natural inner join billingaddress where user_id='+ req.query.user_id +
        ') as temptable on address.address_id=temptable.address_id' ;
	db.client.query(query ,  function(err,results){
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


//get user addresses
exports.address= function(req,res){
	var query= 'select * from address where user_id='+ req.query.user_id + 'order by shippingflag desc';
		
	db.client.query(query ,  function(err,results){
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


exports.checkout = function(req,res){
	console.log(req.body);
	var query;
	db.client.query(query ,  function(err,results){
		if(err){
			console.log(err);
			res.send(401);
		}
		else{
			console.log("Query executed!");
		}
	});
	res.send(200);
};

