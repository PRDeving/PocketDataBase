
PDB.Init(Test);

function Test(){
    test = PDB.Select("test");

    var te = 1000000;

    console.log("Testing write");
    var it = Date.now();
    for(var x = 0; x < te; x++) (x == 756123)? test.Save("esta es la prueba de fuego") : test.Save("lorem ipsum");
    console.log(te," entries in ",(Date.now()-it)/1000," seconds");

    setTimeout(function(){
        console.log("Testing read");
        it2 = Date.now();
        var res = test.Search("lorem");
        console.log(te," iterations and "+res.length+" matches in ",(Date.now()-it2)/1000," seconds");
    },1000);

    setTimeout(function(){
        console.log("Testing read single entry");
        it2 = Date.now();
        var res = test.Search("ego");
        console.log(te," iterations and "+res.length+" matches in ",(Date.now()-it2)/1000," seconds");
        console.log(res);
    },1000);

    setTimeout(function(){
        console.log("Testing read single entry with searchFirst");
        it2 = Date.now();
        var res = test.SearchFirst("ego");
        console.log(te," iterations in ",(Date.now()-it2)/1000," seconds");
        console.log(res);
    },1000);


}