easyMarket (server)
=================

##Introduction
easyMarket is a web app develop for the ICOM 5016 (Database Systems). This repository contains the REST part of this app. 

##Installation
* Use **[nodemon](https://github.com/remy/nodemon)** for development purposes. This module will restart the NodeJS server every time you make a file change.
	* `sudo npm install nodemon`
* To be able to clone and work with this repo you will need to add your SSH Keys to github. Please follow the following [guide](https://help.github.com/articles/generating-ssh-keys#platform-linux)
* After cloning this repo you need to run `npm install`. This command will download all dependencies of the project
* Run the project with `nodemon app.js`
	* Remember `cd` and `ls` commands for movements in the file system
	* Review:
		* `$ cd [folder]` - enter that folder/directory
		* `$ cd ..` - go back
		* `$ ls` - show current folder/dir content
		
####Relevant Files
*  `/routes/[filename].js` are the main modules where queries are implemented
*  `/utilites/routes.js` is the app router, where you set the rest **route** and set the **function** call. 
	*  eg: `app.get('/products', products.products);`

Other than routes directory and routes.js folder, **YOU DONT NEED TO TOUCH ANYTHING ELSE!**
##REST API
* ###GET routes [PRODUCTS]
	* `/products`
		* Parameters: none
	* `/product?product_id=x`
		* Paramaters: **product_ID: int**
		* Return an specific product using its ID
	* `/category?category=x` [0-3]
		* Parameters: **category_ID: int**
		* Return all the products on a specific category
	* `/sale`
		* Return all the products that are for sale only
	* `/auction` 
		* Return all the products that are for AUCTION only
	* `/aucsale` 
		* Return all products that are for both, SALE and AUCTION
* ###GET Routes [USERS]
	* `/login?user=xxxx?password=xxxx`
		* Parameters: User **email** and **password**
		* if found the user on the database, returns the user information
			* else return `401`
	* `/usercc`
		* parameters: **user_id**
		* Returns the credit cards match to the user
		

			
	


