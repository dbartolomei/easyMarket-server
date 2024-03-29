var db = require('../utilities/database');
var md5 = require('MD5');
var email = require('emailjs');

var server  = email.server.connect({ 
        user:"easymarketpr@gmail.com",
        password:"alkfj39a2489vk319dk",
        host:"smtp.gmail.com",
        ssl:true
});

exports.reset = function(req,res){
        console.log(req.query.user_id);
        res.send(200);

        db.client.query('select * from "user" where user_id = '+ req.query.user_id, function(err, results){
                var user_email = results.rows[0].email;
                var user_name = results.rows[0].first_name;
                var temp_password;
                require('crypto').randomBytes(6, function(ex, buf) {
                        temp_password = buf.toString('hex');
                        console.log(user_email);
                        var confirmationMessage = email.message.create({
                                text: '',
                                from : '<easymarketpr@gmail.com',
                                to : user_email, //User email goes here.
                                subject : 'EasyMarket Password Reset Notification',
                                attachment : {
                                        data : '<html>Hi ' +user_name+ ': <br></br> Your new password is <b>'+temp_password+'</b> <br></br> Please change it as soon as posible.</html>',
                                        alternative: true
                                }
                        });
                        server.send(confirmationMessage,function(err, message){
                                if (!err){
                                        console.log('email sent to:', user_email);
                                        console.log(temp_password);
                                        db.client.query('update "user" set password = MD5('+ "'" + temp_password  + "'" +') where user_id =' + req.query.user_id);
                                }
                                else{
                                        console.log('err:',err);
                                }
                        });
                });
        });
};

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
        var query = 'select * from creditcard where user_id = ' + req.query.user_id;
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
	console.log(req.body);
	var query='select * from address inner join (select * from creditcard natural inner join address where user_id='+ req.body.user_id +')';   
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


// //get user addresses
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
                          res.json(content);exports.getuser = function(req,res){
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
                }
        });
};


exports.new_user = function(req,res){
    console.log(req.body);
    var query ='insert into "user" (first_name, last_name, email, password, phone_number, gender, date_of_birth) values (' + "'" + req.body.fname + "','" + req.body.lname + "','" + req.body.email + "',md5('" + req.body.password + "'),'" + req.body.phone + "','" + req.body.gender + "','" + req.body.bday + "');";
    query = query + 'insert into cart(price_total, user_id) values(0.00, (select max(user_id) from "user"));';
  query= query+ 'insert into account(balance, user_id) values(0.00, (select max(user_id) from "user"));';   
    
    
    db.client.query(query,function(err,results){
            if(err){
                    console.log(err);
                    res.send(401);
            }
            else{
                    console.log(results);
            }

    });
    console.log(query);
};


//get user addresses
exports.address= function(req,res){
	var query= "select * from address where user_id="+ req.query.user_id + " order by shippingflag desc";
                
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

exports.new_address = function(req,res){
        console.log(req.body);
        
        var query ='insert into address (address_line1, address_line2, zipcode, country, city, user_id, shippingflag) values ('+ "'" + req.body.line1 + "','" + req.body.line2 + "','" + req.body.zipcode + "','" + req.body.country + "','" + req.body.city + "','" + req.body.userid + "','" + req.body.shipping_address + "');";
        db.client.query(query,function(err,results){
                if(err){
                        console.log(err);
                        res.send(401);
                }
                else{
                        console.log(results);
                }

        });
        console.log(query);
};

exports.new_cc = function(req,res){
        console.log(req.body);
        var query ='insert into creditcard (creditcard_number, cardholder_first_name, cardholder_last_name, company, expiration_date, secret_code, user_id) values (' + "'" + req.body.ccnumber + "','" + req.body.ccownerfname + "','" + req.body.ccownerlname + "','" + req.body.company + "','" + req.body.expdate + "','" + req.body.secretcode + "','" + req.body.user_id + "');";
        query = query + 'insert into billingaddress (address_id, creditcard_id) values (' + req.body.addressid + ', (select max(creditcard_id) from creditcard where user_id=' + req.body.user_id +'));';
        db.client.query(query,function(err,results){
                if(err){
                        console.log(err);
                        res.send(401);
                }
                else{
                        console.log(results);
                }

        });
        console.log(query);
};

exports.getaddress= function(req,res){
        var query= 'select * from address where user_id='+ req.query.user_id;
                
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

// exports.new_billaddress = function(req,res){
//         console.log(req.body);
//         var query2 = 'select max(creditcard_id) from creditcard where user_id=' + req.body.user_id;
//         var query = 'insert into billingaddress (address_id, creditcard_id) values (' + "'" + req.body.addressid + "','"  + query2 + "')";
//         db.client.query(query,function(err,results){
//                 if(err){
//                         console.log(err);
//                         res.send(401);
//                 }
//                 else{
//                         console.log(results);
//                 }
// =======
// 	var query= 'select * from address where user_id='+ req.body.user_id + 'order by shippingflag desc';
		
// >>>>>>> 84aa44bb31be7b35aea81ed8aa7dafbd6e638150
// 	db.client.query(query ,  function(err,results){
// 		if(err){
// 			console.log(err);
// 			res.send(401);
// 		}
// 		else{
// 			console.log(results.rows);
// 			var content = {'data':results.rows};
// 			  res.json(content);
// 		};
// 	});
// };


exports.checkout = function(req,res){
	console.log(req.body);
	
    var query='';
    
    for(var i=0;i<req.body.length;i++){
    	console.log(i);
  query=query+ ' insert into transaction(transaction_date, creditcard_id ,account_number,sell_id,user_id,quantity,price) values(CURRENT_TIMESTAMP, '+ req.body.creditcard_id+ ',(select account_number from account natural join (select user_id from product natural join sell where sell_id=(select max(sell_id) from putincart where cart_id=(select cart_id from cart where user_id='+req.body.user_id+') and active is true) ) as temp) , (select max(sell_id) from putincart where cart_id=(select cart_id from cart where user_id='+req.body.user_id+') and active is true), '+req.body.user_id+', 1,(select price from sell where sell_id=(select max(sell_id) from putincart where cart_id=(select cart_id from cart where user_id='+req.body.user_id+') and active is true)));';
  query=query+ ' update sell set stock=stock-1 where sell_id=(select max(sell_id) from putincart where cart_id=(select cart_id from cart where user_id='+req.body.user_id+') and active is true);  update putincart set active = false where sell_id=(select max(sell_id) from putincart where cart_id=(select cart_id from cart where user_id='+req.body.user_id+') and active is true);';
    
    
    
    }
  query =query + ' update cart set price_total=0.0 where user_id='+req.body.user_id+';  update sell set available=false where stock=0;';
	console.log(query);
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


exports.remove= function(req,res){
	var query;
	console.log(req.body.product_id);
	if(req.body.product_id!=null){
    	
   	query='update putincart set active=false where cart_id=(select cart_id from cart where user_id='+req.body.user_id+') and sell_id=(select sell_id from sell where product_id='+req.body.product_id+'); update cart set price_total=price_total-(select price from sell where product_id='+req.body.product_id+') where cart_id=(select cart_id from cart where user_id='+req.body.user_id+')';
    	
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
