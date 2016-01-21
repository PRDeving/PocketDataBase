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

##UPDATED
-   1.000.000 new entries in 2.501 seconds.
-   1.000.000 iterations to multi-match a "search for content" query in 0.21 seconds
-   1.000.000 iterations to multi-match a "search where" query un 0.091 seconds


(tested in a I7 laptop and google chrome)

#PocketDataBase in numbers
| Test                           | PocketDataBase | MySQL          | MongoDB      |
| -------------                  | :-----------:  | :------------: | :----------: |
| 1M Inserts                     | 2.5 s          | 49 s           | 23s          |
| 1M Filtered by content queries | 0.13 s         | Not Allowed    | Not Allowed  |
| 1M Filtered by "Where" queries | 0.91 s         | 63  s          | 113 s        |
| Export 1M entries DB           | 13 s           | 24  s          | Not Tested   |
| Import 1M entreies DB          | 1.23 s         | 30  s          | Not Tested   |

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
