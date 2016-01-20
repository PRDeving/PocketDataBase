
PDB.Init(Test);

function Test(){
    test = PDB.Select("test");

    var te = 1000000;

    var city = ["Madrid","London","Berlin","New York"];
    var testObject = function(x){
        this.name = "TestEntry"+x;
        this.city = city[Math.floor(Math.random()*4)];
    }

    console.log("Testing write");
    var it = Date.now();
    for(var x = 0; x < te; x++)
        // (x == 756123)? test.Save("esta es la prueba de fuego") : test.Save("lorem ipsum");
        test.Save(new testObject(x));
    console.log(te," entries in ",(Date.now()-it)/1000," seconds");

    setTimeout(function(){
        console.log("Testing read");
        it2 = Date.now();
        var res = test.Search("Berlin");
        console.log(".Search('Berlin'):",te," iterations and "+res.length+" matches in ",(Date.now()-it2)/1000," seconds");
    },1000);

    setTimeout(function(){
        it2 = Date.now();
        var res = test.Search("London");
        console.log(".Search('London'):",te," iterations and "+res.length+" matches in ",(Date.now()-it2)/1000," seconds");
    },1000);

    setTimeout(function(){
        it2 = Date.now();
        var res = test.SearchWhere({city:"Madrid"});
        console.log(".SearchWhere({city:'Madrid'}):",te," iterations and "+res.length+" in ",(Date.now()-it2)/1000," seconds");
    },1000);


}
