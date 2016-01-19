# PocketDataBase
Pocket NoSQL Database in pure Javascript to use in clientside applications

# What it does
PDB does the same work than other NoSQL databases such as mongoDB or CouchDB, but it's focused to local projects and data managment.

# Why should i use it?
Do you have a big game that has to manage lot of data in real time? PDB helps you with an DB structure and a fast search engine.

Do you need to store tons of clients or products and analyze them? PDB gives you the DB engine, with his cache system and quick search.

# Performance
PDB owes his high performance to the linked lists that acts as collections, it has a large cost in memmory efficience terms but gives the speed that a database query needs.

Actually, in his first version, PDB does:
-	1.000.000 new entries in 1.02 seconds.
-	1.000.000 iterations to multi-match a query in 0.476 seconds.
-	a single match query in a 1.000.000 entries database in 0.126 seconds.

(tested in a I7 laptop and google chrome)

# How does it work
PDB uses collections, something similar to "tables" in SQL, there you can store your info in entries, that are stored in a one-way linked list that gives you the fastest iteration possible, this allows PDB to have a match in a huge database faster than other serverside systems.

# Use
```javascript
TDB.Init(init); //initialize TDB and fire the callback once the system is runing

function init(){
	var clients = TDB.Select("clients"); //Select numbers collection to work in

	var obj = {
		name: "Oscar",
		state: "california"
	}
	clients.Save(obj);

	var res = clients.Search("California"); //Gets all entries that contains "California"
	console.log(res);

	var res2 = clients.SearchFirst("California"); //Gets just the first match that contains "California"
	console.log(res2);
}
```