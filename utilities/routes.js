module.exports = function(app,express){
	var users = require('../routes/users');
	var index = require('../routes/index');
	var products = require('../routes/products');
	var search = require('../routes/search');
   
    
    
	app.get('/', index.index);
	

//PRODUCT STUFF
	app.get('/products', products.products);
	app.get('/product', products.productbyID);
	// app.get('/category', products.category);
	app.get('/sale', products.sale);
	app.get('/auction', products.auction);
	app.get('/aucsale', products.auctionAndSale);

	
	//search for products
	app.get('/search/products/category', search.category);
	
	//search for categories
	app.get('/search/categories/root', search.rootcategories);
	app.get('/search/category', search.childscategories);



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
    app.get('/creditcard', users.creditcard);
    app.get('/address', users.address);
	//ADMIN STUFF

	app.get('/userlist', users.allusers);
	app.get('/user', users.getuser);
	
	app.get('/salesbyday', products.salesbyday);
	app.get('/salesbyweek', products.salesbyweek);
	app.get('/salesbymonth', products.salesbymonth);
	app.get('/productbyday', products.productbyday);
	app.get('/productbymonth', products.productbymonth);
	app.get('/productbyweek', products.productbyweek);
	app.post('/loginadmin', users.loginadmin);

	app.post('/new_address', users.new_address);
	
}

