const express = require('express');
const app = express();
const server = require('http').Server(app);
const io=require('socket.io')(server);
app.set('view engine','ejs');
app.use(express.static('public'));

const { v4: uuidv4 } = require('uuid');

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
});

app.get('/:room',(req,res)=>{
    res.render('room',{ roomId : req.param.room})
});

io.on('connection', socket =>{
    socket.on('join-room',() => {
        console.log("joined room");
    })
})



server.listen(3030);