const pronote = require("pronote-lib");
const pronoteAPI=require("pronote-api");
const express = require("express");
const http  = require("http");
const path = require("path");
const cors = require("cors");


const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

let save = [];

app.use(cors())
app.use(express.static(path.join(__dirname,"/dist/pronote")))


app.get("/:id",(req,res)=>{
    res.redirect("/");
})
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname),{});
})

app.post("/location",(req,res)=>{
    if(req.query.lat!=undefined&&req.query.long!=undefined){
        pronote.geo(req.query.lat,req.query.long).then(data=>{
            res.status(200).send(data);
        }).catch(err=>{
            res.status(444).send({error:true,data:err});
        })
    }else{
        res.status(400).send({error:true,data:false});
    }
})

app.post("/connexion",(req,res)=>{
    if(req.query.password!=undefined&&req.query.username!=undefined&&req.query.url){
        let password = req.query.password;
        let username = req.query.username;
        let url = req.query.url;
        pronoteAPI.login(url,username,password).then(session=>{
            save.push({session:session,id:session.id});
            res.status(200).send({error:false,data:session});
        }).catch(err=>{
            res.status(401).send({error:true,data:err});
        })
    }else{
        res.status(400).send({error:true,data:false});
    }
})

app.post("/user/:type",(req,res)=>{
    if(req.params.type&&req.query.id){
        save.forEach(item=>{
            if(item.id==req.query.id){
                let find = false;
                let list = ["absences","contents","evaluations","homeworks","infos","marks","timetable","menu"]
                list.map(func=>{
                    if(func===req.params.type){
                        find=true;
                        if(func=="homeworks"){
                            let past = new Date();
                            let futur = new Date().setDate(new Date().getDate() + 20);
                            item.session[func](past,futur).then(all=>{
                                res.status(200).send({error:false,data:JSON.stringify(all)})
                            }).catch(err=>{
                                res.send({error:true,data:err});
                            })
                        }else if(func=="contents"){
                            let past = new Date().setDate(new Date().getDate() - 30);
                            let now = new Date();
                            item.session[func](past,now).then(all=>{
                                res.status(200).send({error:false,data:JSON.stringify(all)})
                            }).catch(err=>{
                                res.send({error:true,data:err});
                            })
                        }else if(func=="marks"||func=="evaluations"){
                            item.session[func]('year').then(all=>{
                                res.status(200).send({error:false,data:JSON.stringify(all)})
                            }).catch(err=>{
                                res.send({error:true,data:err});
                            })
                        }else{
                            item.session[func]().then(all=>{
                                res.status(200).send({error:false,data:JSON.stringify(all)})
                            }).catch(err=>{
                                res.send({error:true,data:err});
                            })
                        }
                        
                    }
                })
                if(!find){
                    res.send({error:true,data:"null"})
                }
            }
        })
        if(save.length==0){
            res.send({error:true,data:"null"})
        }
    }else{
        res.status(401).send({error:true,data:false});
    }
})


server.listen(PORT,()=>{});