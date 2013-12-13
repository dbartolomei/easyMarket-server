module.exports = function(app,express){
	var users = require('../routes/users');
	var index = require('../routes/index');
	var products = require('../routes/products');
	var search = require('../routes/search');
	
	app.get('/', index.index);
	

//PRODUCT STUFF
   
	app.get('/products', products.products);
	app.get('/product', products.productbyID); 
	app.post('/new_product', products.new_product);
	app.post('/add_product', products.add_product);
	app.post('/bid_product', products.bid_product);
	app.post('/accept_bid', products.accept_bid);
	// app.get('/category', products.category);
	app.get('/sale', products.sale);
	app.get('/auction', products.auction);
	app.get('/aucsale', products.auctionAndSale);
	app.get('/categoriesfornewproduct',products.categoriesfornewproduct);

	
	//search for products
	app.get('/search/products/category', search.category);
	app.get('/search/products/get_all_cat_products', search.get_all_cat_products);


	//search for categories
	app.get('/search/categories/root', search.rootcategories);
	app.get('/search/category', search.childscategories);
	app.get('/search/search_query', search.search_query);


	//http://localhost:5000/userlist

	//USER STUFF
	app.post('/login', users.login);
	app.get('/usercc', users.getcc);

    //ACCOUNT STUFF
    app.get('/cartproducts', users.cartproducts);
    app.get('/orders', users.orders);
    app.get('/winningbids', users.winningbids);
    app.get('/losingbids', users.losingbids);
    app.get('/auctionproducts', users.auctionproducts);
    app.get('/sellingproducts', users.sellingproducts);
    app.get('/creditcard', users.getcc);
    app.get('/address', users.address);
    app.post('/new_address', users.new_address);
    app.post('/checkout', users.checkout);
    app.post('/remove', users.remove);
    app.post('/new_creditcard',users.new_cc);
	//ADMIN STUFF

	app.get('/userlist', users.allusers);
	app.get('/user', users.getuser);

	app.get('/getaddress', users.getaddress);

	app.get('/getaddress', users.getaddress);


	app.get('/reset', users.reset);
	
	app.get('/salesbyday', products.salesbyday);
	app.get('/salesbyweek', products.salesbyweek);
	app.get('/salesbymonth', products.salesbymonth);
	app.get('/productbyday', products.productbyday);
	app.get('/productbymonth', products.productbymonth);
	app.get('/productbyweek', products.productbyweek);
	app.post('/loginadmin', users.loginadmin);

	app.get('/getaddress',users.getaddress);
	
	
	app.post('/new_user', users.new_user);
	app.post('/new_creditcard', users.new_cc);
	// app.post('/new_billaddress', users.new_billaddress);
	
};


