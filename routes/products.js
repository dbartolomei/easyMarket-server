var db = require('../utilities/database');


//get all products
exports.products = function(req, res){
	db.client.query('select * from product where product_id in (select product_id from sell where available is true) or product_id in (select product_id from auction where available is true)', function(err,results){
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

//products to search with price
exports.searchproducts = function(req, res){
	
	db.client.query('select * from product natural join (select sell_id, sell.price as sell_price, sell.stock as sell_stock,  case when sell.product_id is null then auction.product_id  else sell.product_id end, sell.available as sell_available,auction_id, auction.price as auction_price, auction.available as auction_available from sell full outer join auction on sell.product_id=auction.product_id where sell.available is not false and auction.available is not false) as temptable order by product_name', function(err,results){
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

//products in your cart
exports.cartproducts = function(req, res){
	
	db.client.query('select * from product natural join (select sell.sell_id,sell.price, product_id, price_total from sell inner join (select * from cart natural join putincart where active is true) as temptable on sell.sell_id=temptable.sell_id) as temptable2', function(err,results){
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


//get products by ID
exports.productbyID = function(req, res){
	var product = {}
	//var query = 'select * from product where 2 in (select product_id from sell where available is true) and product_id in (select product_id from auction where available is true)';
	//var query = 'select  * from sell full outer join auction natural join product on sell.product_id = auction.product_id where sell.product_id=3 or auction.product_id=3';
	var query = 'select * from product natural join (select sell_id, sell.price as sell_price, sell_date, sell.stock as sell_stock,  case when sell.product_id is null then auction.product_id else sell.product_id end, sell.available as sell_available, auction_id, auction.price as auction_price, start_time, end_time, auction.available as auction_available  from sell full outer join auction on sell.product_id=auction.product_id ) as tempProducts where product_id = ' + req.query.id;
	db.client.query(query, function(err,results){
		if(err){
			console.log(err);
			res.send(401);
		}
		else{
			content = results.rows[0];
			if(content.auction_available = true){
				var bidQuery = 'select * from bid where auction_id = '+ req.query.id+' and bid_date = (select max(bid_date) from bid where auction_id = '+ req.query.id+')';
				db.client.query(bidQuery, function(err2, results2){
					content['current_auction'] = null;
					if(results2.rows[0] != null){
						content['current_auction'] = results2.rows[0].price;
					}
				console.log(content);
				res.json(content);
				})
			}
		};
	});
};

//get products that are for SALE
exports.sale = function(req,res){
	db.client.query('SELECT * FROM product natural join sell WHERE available = true', function(err,results){
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

//get products that are for AUCTION
exports.auction = function(req,res){
	db.client.query('SELECT * FROM product natural join auction WHERE available = true', function(err,results){
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

//get products that are available for SALE and AUCTION
exports.auctionAndSale = function(req,res){
	db.client.query('select * from product where product_id in (select product_id from sell where available is true) and product_id in (select product_id from auction where available is true)',  function(err,results){
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
exports.sellingproducts = function(req,res){
	db.client.query('select product_id, product_name, description, brand, price, stock from product natural join sell where available is true and user_id=2',  function(err,results){
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


exports.auctionproducts = function(req,res){
		
	db.client.query('select product.product_id, product_name, description, brand,auction_price, end_time, bid_price, bid_date, bid_user from product inner join (select product_id , auction.price as auction_price, end_time, bid.price as bid_price, bid_date, bid.user_id as bid_user , available from auction inner join bid on auction.auction_id=bid.auction_id where available is true) as temp on temp.product_id=product.product_id where available is true and product.user_id=2 order by product.product_id,bid_date desc',  function(err,results){
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
exports.winningbids = function(req,res){
	db.client.query('select product.product_id, product_name, bid_date, temp.price, end_time from product inner join (select product_id,highbid.price,bid_date, end_time from ( select * from bid where user_id=2 and bid_date=(select max(bid_date) from bid as bidtemp where bidtemp.auction_id= bid.auction_id)) as highbid inner join auction on highbid.auction_id=auction.auction_id where available is true ) as temp on temp.product_id=product.product_id',  function(err,results){
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


exports.losingbids = function(req,res){
	db.client.query('select product.product_id, product_name, bid_date, temp.price, end_time from product inner join (select product_id,highbid.price,bid_date, end_time from ( select * from bid where user_id=6 and bid_date!=(select max(bid_date) from bid as bidtemp where bidtemp.auction_id= bid.auction_id)) as highbid inner join auction on highbid.auction_id=auction.auction_id where available is true ) as temp on temp.product_id=product.product_id',  function(err,results){
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
exports.salesbyday= function(req, res){
	db.client.query("select  date_part('day', transaction_date) as day,date_part('month', transaction_date) as month, date_part('year', transaction_date) as year, sum(price)as price, sum(quantity) as quantity from transaction group by day,month, year order by year,month,day", function(err,results){
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
exports.salesbyweek= function(req, res){
	db.client.query("select  date_part('week', transaction_date) as week, date_part('year', transaction_date) as year, sum(price)as price, sum(quantity) as quantity from transaction group by week, year order by year,week", function(err,results){
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
exports.salesbymonth= function(req, res){
	db.client.query("select  date_part('month', transaction_date) as month, date_part('year', transaction_date) as year, sum(price)as price, sum(quantity) as quantity from transaction group by month, year order by year,month", function(err,results){
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

exports.productbyday= function(req, res){
	var query="select date_part('day', transaction_date) as day,date_part('month', transaction_date) as month,date_part('year', transaction_date) as year, sum(price) as price,sum(quantity) as quantity, product.product_id, product_name from product inner join (select transaction_date,quantity, transaction.price, product_id from transaction inner join sell on transaction.sell_id=sell.sell_id) as temptable on product.product_id=temptable.product_id group by product.product_id, product_name, day,month, year order by product.product_id,year,month ,day";
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
exports.productbymonth= function(req, res){
	var query="select date_part('month', transaction_date) as month,date_part('year', transaction_date) as year, sum(price) as price,sum(quantity) as quantity, product.product_id, product_name from product inner join  (select transaction_date,quantity, transaction.price, product_id from transaction inner join sell on transaction.sell_id=sell.sell_id) as temptable on product.product_id=temptable.product_id group by product.product_id, product_name, month, year order by product.product_id,year,month";
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
exports.productbyweek= function(req, res){
	var query="select date_part('week', transaction_date) as week,date_part('year', transaction_date) as year, sum(price) as price,sum(quantity) as quantity, product.product_id, product_name from product inner join (select transaction_date,quantity, transaction.price, product_id from transaction inner join sell on transaction.sell_id=sell.sell_id) as temptable on product.product_id=temptable.product_id group by product.product_id, product_name, week, year order by product.product_id,year,week";
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
//new product

//new product

exports.new_product = function(req,res){
	console.log(req.body);
	var query;
	//sell
	if((req.body.sellprice!='$')&&(req.body.auctionprice=='$')){
// 		
		query='insert into product(product_name, description, model, image, brand, dimensions, category_id,user_id) values('+"'"+req.body.name+"'"+' , '+"'"+req.body.description+"'"+' , '+"'"+req.body.model+"'"+' ,  '+"'"+req.body.image +"'"+' , ' +"'"+ req.body.brand+"'"+','+"'"+req.body.dimensions+"'"+','+req.body.category+','+req.body.user_id+ '); insert into sell(price, sell_date, stock, product_id,available) values ('+ req.body.sellprice+', current_date ,'+req.body.stock+',(select max(product_id) from product),true)';
	}
	//auction	and sell
	if((req.body.sellprice=='$')&& (req.body.auctionprice!='$')){
		
		query='insert into product(product_name, description, model, image, brand, dimensions, category_id,user_id) values('+"'"+req.body.name+"'"+' , '+"'"+req.body.description+"'"+' , '+"'"+req.body.model+"'"+' ,  '+"'"+req.body.image +"'"+' , ' +"'"+ req.body.brand+"'"+','+"'"+req.body.dimensions+"'"+','+req.body.category+','+req.body.user_id+ '); insert into auction(price, start_time, end_time, product_id,available) values ('+ req.body.auctionprice+', current_timestamp ,'+"'"+req.body.end_time+"'"+',(select max(product_id) from product),true)';
	}
	//auction
	else{
		
		query='insert into product(product_name, description, model, image, brand, dimensions, category_id,user_id) values('+"'"+req.body.name+"'"+' , '+"'"+req.body.description+"'"+' , '+"'"+req.body.model+"'"+' ,  '+"'"+req.body.image +"'"+' , ' +"'"+ req.body.brand+"'"+','+"'"+req.body.dimensions+"'"+','+req.body.category+','+req.body.user_id+ '); insert into auction(price, start_time, end_time, product_id,available) values ('+ req.body.auctionprice+', current_timestamp ,'+"'"+req.body.end_time+"'"+',(select max(product_id) from product),true); insert into sell(price, sell_date, stock, product_id,available) values ('+ req.body.sellprice+', current_date ,'+req.body.stock+',(select max(product_id) from product),true)';
	}
	
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

exports.categoriesfornewproduct= function(req, res){
	var query="select temptable.parent_id, parent_name, temptable.category_id, category_name, child.category_id as child_id, child.name as child_name from category as child right outer join(select parent.name as parent_name, parent.category_id as parent_id, category.name as category_name , category.category_id as category_id from category inner join category as parent on category.parent_id=parent.category_id where parent.parent_id is null ) as temptable on temptable.category_id=child.parent_id ";
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


//add product to cart

exports.add_product = function(req,res){
	console.log(req.body);
	var query;
	query='insert into putincart(cart_id, sell_id, quantity, active) values((select cart_id from cart where user_id='+ req.body.user_id+'),(select sell_id from sell where  product_id='+ req.body.product_id +'),1,true ); update cart set price_total=((select price_total from cart where user_id='+ req.body.user_id+')+(select price from sell where  product_id='+ req.body.product_id+')) where user_id='+ req.body.user_id+';';
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





