const express = require('express');
const app = express();
app.use(express.json({limit : "10mb"}));
app.use(express.urlencoded({limit:"10mb",extended: false}));
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 




var db;

const port = process.env.PORT || 8080 ;
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(http, {
  debug:true,
  path: '/peerjs'
});
app.use('/', peerServer);

MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
  if (에러) return console.log(에러)

  http.listen(port, function() {
    console.log('listening on 8080')
  })

});

app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

app.get('/main/:page',function(req,res){
  
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
  db=client.db('test');
    var tpage;
   db.collection('posting').find().toArray(function(err,result0){
     tpage= parseInt(result0.length);  
     if(tpage==0){tpage=1;}
     tpage=Math.ceil(tpage/4);
   });
  
    var page=parseInt(req.params.page);

    db.collection('posting').find().sort({_id:-1}).skip((page-1)*4).limit(4).toArray(function(err,result){
      console.log(result);
      res.render('boardlist.ejs',{posts:result,사용자: req.user,총페이지:tpage,현재페이지:page}); 
    })
  })
});

app.get('/write',function(req,res){
  res.render('write.ejs')
});

app.post('/write',function(req,res){

  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
  db=client.db('test');

  db.collection('counter').findOne({name:'글수'},function(err,result){
    console.log(result.totalNum);
    var total=result.totalNum;
  db.collection('posting').insertOne( {제목 : req.body.title,본문 : req.body.maintxt ,카테고리:req.body.cate,작성자:req.user.nick ,_id : total+1,작성시간:req.body.wtime ,목록:[],시간:'05/12/2023 10:02 AM', 글상태:'모집중',수강자:[]} , function(err, result){

   db.collection('counter').updateOne({name:'글수'},{$inc:{totalNum:1}},function(err,result){
        if(err) return console.log(err);
         })   
   });
   db.collection('comment').insertOne({글번호:total+1 ,총댓글수:0, 댓글:[]

   });  
     
   db.collection('image').insertOne({_id : total+1, 주소:req.body.이미지

   });
    });
  }); 
  res.redirect('/main/1') 
});

app.post('/comment',function(req,res){

  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
  db=client.db('test');
  console.log(req.body.wctime);
  db.collection('comment').findOne({글번호:parseInt(req.body.postnum)} ,function(err,result){
    var total=result.총댓글수;
  db.collection('comment').updateOne({글번호:parseInt(req.body.postnum)},{$inc:{총댓글수:1}},function(err,result){
      if(err) return console.log(err);
       })  
  if(req.body.reply=="댓글"){
    console.log('댓글');
  db.collection('comment').updateOne({글번호:parseInt(req.body.postnum)},{$push :{댓글:{$each:[{번호:total+1,작성자:req.body.nickname,내용:req.body.comment,상태:req.body.reply,시간:req.body.wctime}]}}},function(err,result){

    });     
  } 
  else if(req.body.reply=="답글"){
    console.log('답글');
    db.collection('comment').updateOne({글번호:parseInt(req.body.postnum)},{$push :{댓글:{$each:[{번호:total+1,작성자:req.body.nickname,내용:req.body.comment,상태:req.body.reply,시간:req.body.wctime
      ,답글번호:req.body.renum,답글이름:req.body.rename}]}}},function(err,result){
    
        });    
  }  
  });

  });
  var num=req.body.postnum;
  res.redirect('/board/'+num);  
  });


 
app.post('/newuser',function(req,res){
  //req.body.uid
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    if (에러) return console.log(에러)
    db=client.db('test');

    db.collection('counter').findOne({name:'유저데이터아이디값'},function(err,result){
      
      var total=result.totalId;

    db.collection('post').insertOne( {userid : req.body.uid,nick : req.body.unick ,pwd:req.body.psw,myself:"" ,_id : total+1,총평점:0,총평점수:0} , function(err, result){
        console.log('저장완료'); 
        db.collection('counter').updateOne({name:'유저데이터아이디값'},{$inc:{totalId:1}},function(err,result){
          if(err) return console.log(err);
        })
      });      
    });
  })
  res.redirect('/')
});

app.post('/login',passport.authenticate('local', {
  failureRedirect : '/fail'
}),function(req,res){
    res.redirect('/main/1'); //여기 바꿈
});

app.get('/fail',function(req,res){
    res.send('실패');
  });


app.get('/list/:id',function(요청,응답){
        
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    db=client.db('test');
    console.log(요청.params.id);
    db.collection('posting').find({카테고리:요청.params.id}).toArray(function(에러, 결과){
      console.log(결과);
      
      응답.render('boardlist2.ejs',{posts:결과,사용자:요청.user,카테:요청.params.id});  
    });   
  });
    
  });



app.get('/board/:id', function(요청, 응답){

  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    db=client.db('test');

    db.collection('posting').findOne({_id : parseInt(요청.params.id)},function(err,result){
    db.collection('comment').findOne({글번호:parseInt(요청.params.id)},function(err,result2){
      db.collection('image').findOne({_id:parseInt(요청.params.id)},function(err,result3){
        db.collection('rating').findOne({글번호:parseInt(요청.params.id)},function(err,result4){
          응답.render('board.ejs',{data:result,사용자:요청.user,글번호:요청.params.id,cdata:result2,이미지주소:result3,후기:result4});
          });
        });
      });
    });
    });
  });

app.get('/edit/:id',function(요청,응답){
    MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    db=client.db('test');
    db.collection('image').findOne({_id:parseInt(요청.params.id)},function(err,result0){
      db.collection('posting').findOne({_id : parseInt(요청.params.id)},function(err,result){
        응답.render('edit.ejs',{data:result,imgdata:result0});    
      });
    })

    });
});

app.put('/edit',function(요청,응답){
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    db=client.db('test');
    db.collection('image').updateOne({_id : parseInt(요청.body.id)},{$set:{주소:요청.body.이미지}},function(err,result0){
      db.collection('posting').updateOne({_id : parseInt(요청.body.id)},
      {$set : {제목 :요청.body.title ,본문 : 요청.body.maintxt,카테고리:요청.body.cate}},function(err,result){
        var num=parseInt(요청.body.id);
        응답.redirect('/board/'+num);
      });
    });

    });     
});

app.get('/delete/:id', function(요청, 응답){
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    db=client.db('test');
    db.collection('posting').deleteOne({_id:parseInt(요청.params.id)}, function(에러, 결과){
      db.collection('comment').deleteOne({글번호:parseInt(요청.params.id)}, function(에러, 결과){
        db.collection('image').deleteOne({_id:parseInt(요청.params.id)}, function(에러, 결과){
        
        })        
      })
  })
  응답.redirect('/main/1');
});

});

app.get('/userpage/username/:nick',function(요청,응답){
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    db=client.db('test');  
    db.collection('post').findOne({nick:요청.params.nick}, function(에러, 결과){
      var tutorid=결과.userid;
      응답.redirect('/userpage/'+tutorid);      
  })
});
});

app.get('/userpage/:id', function(요청, 응답){
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    db=client.db('test');  
  db.collection('post').findOne({userid : 요청.params.id},function(err,result0){
    var name=result0.nick;  
    db.collection('posting').find().toArray(function(err,result){
      db.collection('posting').find({작성자:name}).toArray(function(err,result1){
        db.collection('posting').find({강의자:name}).toArray(function(err,result2){     
        db.collection('comment').find({"댓글.작성자":name}).toArray(function(err,result3){
          db.collection('rating').find().toArray(function(err,result4){
응답.render('userpage.ejs',{udata:result0,data:result,wdata:result1,사용자:요청.user,tdata:result2,cdata:result3,rdata:result4,주소아이디:요청.params.id});
            });           
          });              
        });                
      });              

      }); 

           
    });   
    
      })  
});


app.post('/myself',function(요청,응답){
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    db=client.db('test');
    db.collection('post').updateOne({userid : 요청.body.id},
    {$set : {myself : 요청.body.mainmyself}},function(err,result){
      응답.redirect('/userpage/'+요청.body.id);
    });
    });     
});


app.get('/mypage', 로그인했니, function (요청, 응답) { 
    console.log(요청.user); 
    응답.render('mypage.ejs', { 사용자: 요청.user }) 
  }) 
  
  function 로그인했니(요청, 응답, next) { 
    if (요청.user) { 
      next() 
    } 
    else { 
      응답.send('로그인을 하지 않으셨습니다.') 
    } 
  } 

app.post('/tutor',function(요청,응답){
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    if (에러) return console.log(에러)
    db=client.db('test');
    
    db.collection('posting').updateOne({_id : parseInt(요청.body.글번호)},{$push :{목록:{$each:[{시간:요청.body.시간일정,
      튜터:요청.body.작성자}],$sort: {시간:1}}} },function(err,result){
      
    });    
  });
  var num=요청.body.글번호;
  응답.redirect('/board/'+num);
});

app.post('/del',function(요청,응답){
   
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
   db=client.db('test');
  db.collection('posting').updateOne({_id:parseInt(요청.body.글번호)},{$pull: { 목록: { 시간:요청.body.시간,튜터:요청.body.튜터 } }},function(err,result){
   });
  });
  var num=요청.body.글번호;
  응답.redirect('/board/'+num);  
});

app.delete('/delete', function(요청, 응답){
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
   db=client.db('test');
var boardid=parseInt(요청.body._id);
var num=parseInt(요청.body.number);
var name; var text; var re; var t;
db.collection('comment').findOne({글번호 : boardid},function(err,result){
  for(var i=0;i<result.댓글.length;i++){
    if(parseInt(result.댓글[i].번호)==num){
       name=result.댓글[i].작성자; 
       text=result.댓글[i].내용;
       re=result.댓글[i].상태;
       t=result.댓글[i].시간;
       console.log('호');
       console.log(name,text,re,t);
    }
  }
  db.collection('comment').updateOne({글번호 : boardid},{$pull: { 댓글: { 번호:num , 작성자:name,
    내용:text,상태:re,시간:t } }},function(err,result){
      console.log(name,text,re,t);
      console.log('삭제');
    });
        
});

  
 

});
//응답.redirect('/board/'+boardid);
       
  });


app.post('/schedule',function(요청,응답){
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    db=client.db('test');

    db.collection('posting').updateOne({_id:parseInt(요청.body.글번호)},{$push:{수강자:요청.body.작성자}},function(err,result){
    });  

    db.collection('posting').updateOne({_id:parseInt(요청.body.글번호)},{$set:{시간:요청.body.시간,강의자:요청.body.튜터,글상태:'강의대기'}},function(err,result){
    });



     
  });
  var num=요청.body.글번호;
  응답.redirect('/board/'+num);
});

app.post('/reservation',function(요청,응답){
   
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
  
  db=client.db('test');
  db.collection('posting').updateOne({_id:parseInt(요청.body.글번호)},{$push:{수강자:요청.body.닉}},function(err,result){
  });
  });
 
  var num=요청.body.글번호;
  응답.redirect('/board/'+num);
});

var usernick;

app.get('/room/:id',function(요청,응답){
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    db=client.db('test');
      db.collection('posting').updateOne({_id:parseInt(요청.params.id)},{$set:{글상태:'강의중'}},function(err,result){      
       });    
   

        db.collection('posting').findOne({_id:parseInt(요청.params.id)},function(err,result){
              
          usernick=요청.user.nick;
          console.log(result.강의자);

          db.collection('image').findOne({_id:parseInt(요청.params.id)},function(err,result1){ 
            응답.render('room.ejs',{글번호:요청.params.id,사용자:요청.user,강의자:result.강의자,이미지주소:result1});  
  
       });
        
     });
   
  });

});

app.post('/done',function(요청,응답){
  console.log('접속');
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    db=client.db('test');
      db.collection('posting').updateOne({_id:parseInt(요청.body.postnum)},{$set:{글상태:'완료'}},function(err,result){      
//        db.collection('rating').insertOne({글번호:parseInt(요청.body.postnum),평가:[]},function(요청,응답){
          응답.redirect('/board/'+요청.body.postnum);
      
          
 //       });     
      });    
  });
});

app.post('/rating',function(req,응답){
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    db=client.db('test');
   
    db.collection('rating').updateOne({글번호:parseInt(req.body.title)},{$push :{평가:{$each:[{작성자:req.body.nick,내용:req.body.ratingcomment,평점:parseInt(req.body.rating3) }]}}},function(err,result){
      db.collection('posting').findOne({_id:parseInt(req.body.title)},function(err,result){
        teacher=result.강의자;
      db.collection('post').findOne({nick:teacher},function(err,result0){
        var num=parseInt(result0.총평점); 
        var num2=parseInt(result0.총평점수)+1;
        db.collection('post').updateOne({nick:teacher},{$set:{총평점수:num2}},function(err,result){
          db.collection('post').updateOne({nick:teacher},{$set:{총평점:Math.round((num+parseInt(req.body.rating3))/num2)}},function(err,result){
            응답.redirect('/board/'+parseInt(req.body.title));
         });
        });

      })        
      });
    }); 
  });
});

const login = new Array();

io.on('connection', function(socket){
  socket.on('joinroom', function(data0,peerid){

    if(login.length>=1){
      var m=0;
      for(var i=0;i<login.length;i++){
        if(login[i]['user']==usernick){
          m=1; 
          //이미 정보에 있을 때
          break;
        }
      } 
      if(m==0){
        login.push({ socket:socket.id
        ,  room : String(data0) 
        , user : usernick   
        })         
      }      
    }else{
      login.push({
        socket:socket.id
      ,  room : String(data0)  // 접속한 강의실의 번호
      , user : usernick   // 접속자의 유저의 이름
      })      
    }
  
    socket.join(String(data0)); 
    io.to(String(data0)).emit('count',login);
    socket.broadcast.to(String(data0)).emit('user-connected', peerid);
    
    socket.on('disconnecting',function(){    
      for(var i=0;i<login.length;i++){
       
        if(login[i]['socket']==socket.id){
          var name=login[i]['user'];
          break;
        }
      } 

      for(var i=0;i<login.length;i++){      
         if(login[i]['user']==name){
            var n=i;
            console.log(n); 
            break;
        }}
      login.splice(n,1);

      io.to(String(data0)).emit('bye',name);
      io.to(String(data0)).emit('count',login);
      //떠남
      console.log(login);
    });

    socket.on('user-send', function(data){
      io.to(String(data0)).emit('broadcast', data);
   }); 

   socket.on('done',function(){
      io.to(String(data0)).emit('exit');
   })

   socket.on('notifi',function(nick){
      io.to(String(data0)).emit('alarm',nick);
   })
  });
});

passport.use(new LocalStrategy({
  usernameField: 'uid',
  passwordField: 'psw',
  session: true,
  passReqToCallback: false,
}, function (입력한아이디, 입력한비번, done) {
  console.log(입력한아이디, 입력한비번);
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
    if (에러) return console.log(에러)
    db=client.db('test');

  db.collection('post').findOne({ userid: 입력한아이디 }, function (에러, 결과) {
    if (에러) return done(에러)

    if (!결과) return done(null, false, { message: '존재하지않는 아이디' })
    if (입력한비번 == 결과.pwd) {
      return done(null, 결과)
    } else {
      return done(null, false, { message: '틀린 비밀번호' })
    }
  })
});
}));

passport.serializeUser(function (user, done) {
  done(null, user.userid)
});

passport.deserializeUser(function (아이디, done) {
  MongoClient.connect('mongodb+srv://master:abc1234@cluster0.bk2pv.mongodb.net/test?retryWrites=true&w=majority', function(에러, client){
      db.collection('post').findOne({ userid: 아이디 }, function (에러, 결과) {
      done(null, 결과)
    })
  });
}); 
