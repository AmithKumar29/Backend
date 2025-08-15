const express = require('express');
const app = express();
const path = require('path');
const fs=require('fs');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    fs.readdir(`./hisaab`,function(err,files){
        if(err) return res.status(500).send(err);
        res.render("index",{files:files});
    })
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.post("/createhisaab",function(req,res){
    var cd=new Date();
    var date=`${cd.getDate()}-${cd.getMonth()+1}-${cd.getFullYear()}`
    fs.writeFile(`./hisaab/${date}.txt`,req.body.content,function(err){
        if(err) return res.status(500).send(err);
        res.redirect("/");
    });

})

app.get('/edit/:filename', (req, res) => {
    fs.readFile(`./hisaab/${req.params.filename}`,"utf-8",function(err,filedata){
        if(err) return res.status(500).send(err);
        res.render("edit",{filedata,filename:req.params.filename});
    })
});

app.post("/update/:filename",(req,res)=>{
    fs.writeFile(`./hisaab/${req.params.filename}`,req.body.content,function(err){
        if(err) return res.status(500).send(err);
        res.redirect("/");
    })
})

app.get("/hisaab/:filename",function(req,res){
    fs.readFile(`./hisaab/${req.params.filename}`,"utf-8",function(err,filedata){
        if(err) return res.status(500).send(err);
        res.render("hisaab",{filedata,filename:req.params.filename});
    })
})

app.get("/delete/:filename",function(req,res){
     fs.unlink(`./hisaab/${req.params.filename}`,function(err){
        if(err) return res.status(500).send(err);
        res.redirect("/");
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
