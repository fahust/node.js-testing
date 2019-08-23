let express = require('express');
let bodyParser = require('body-parser')
var jwtUtils = require('./utils/jwt.utils');
let app = express();//framework
let http = require('http').Server(app);
let session = require('express-session')
var bcrypt    = require('bcrypt');
//var jwt    = require('jsonwebtoken');
var io = require('socket.io')(http);


io.sockets.on('connection', function(socket){
    //console.log('a user is connected');
    socket.on('disconnect', function(){
        //console.log('a user is disconnected');
    })
    socket.on('chat message', function (msg){
        //console.log('message recu ' + msg)
        io.emit('chat message', msg)



    })
})


// Constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,20}$/;


app.set('view engine', 'ejs')//moteur de template

//nos middleware
app.use('/assets',express.static('public'))//donner accer a public
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use(session({
    cookieName: 'session',
    secret: 'nimportequoi',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(require('./middlewares/flash'))//middlewares fait maison


   
//routes
app.get('/', (request, response ) => {
    
    let Message = require('./middlewares/message')
    Message.all(function (messages) {
    response.render('pages/index', {messages :messages})//renvoyer une page
    })
    
})

//routes
app.get('/chat', (request, response ) => {
    
    let Message = require('./middlewares/message')
    Message.all(function (messages) {
    response.render('pages/chat', {messages :messages})//renvoyer une page
    })
    
})



app.get('/delete:id', (request, response ) => {
    let Message = require('./middlewares/message')
    var id = request.params.id
    var id = out = id.substring(1,id.length);
    console.log(id)
    Message.delete(id)
    Message.all(function (messages) {
    response.render('pages/index', {messages :messages})//renvoyer un page
    })
    
})



app.post('/',(request,response) => {
    if (request.body.message === undefined || request.body.message === '') {
        request.session.error = "Il y a une erreur"
        request.flash('error',"vous n'avez pas posté de message")//middlewares
        response.redirect('/')
        
    } else {
        let Message = require('./middlewares/message')
        Message.create(request.body.message, function () {
            request.flash('success', "Envoi réussi !")
            response.redirect('/')
        })
    }
})


app.post('/register',(request,response) => {
    if (request.body.message === undefined || request.body.message === '') {
        request.session.error = "Il y a une erreur"
        request.flash('error',"vous n'avez pas rempli les champs")//middlewares
        response.redirect('/')  
    } else {
        let Message = require('./middlewares/register')
        tabuser = []
        tabuser.push(request.body.message)
        tabuser.push(request.body.password)
        Message.all(function(messages) {
            var user = -1
        const callback = function(element) {
            user = 1
        }

            messages.forEach( func = function(element) {
                if (request.body.message == element.row.username){
                    callback(element)
                }
              })

              if (user == -1){
                  if (PASSWORD_REGEX.test(request.body.password)) {
                Message.create(tabuser, function () {
                    request.flash('success', "Inscription réussi !")
                    response.redirect('/')
                })}else{
                    request.flash('error', "Mot de passe invalide (Doit avoir une longueur comprises entre 4 et 12 caractères et inclure un nombre au moins")
                    response.redirect('/')
                }
            }else{
                    request.flash('error', "Ce nom d'utilisateur est déja pris")
                    response.redirect('/')
                }
        })
        
        
    }
})

app.post('/login', (request, response ) => {
    //console.log(request.session.token)
    let Message = require('./middlewares/register')
    Message.all(function(messages) {
        var correspondance = -1
          const mess = request.body.message
          const passw = request.body.password
          var user = -1
          const callback = function(element) {
            user = element
        }
        const callback2 = function(element,error) {
            correspondance = element
            if(correspondance > 0){
            request.flash('success', error)
        }else{
           request.flash('error',error )
        }
        
        if (!request.session.token){
        //fonction de date
        

        request.session.token = jwtUtils.generateTokenForUser(user)}else{
            jwtUtils.verifydate(request.session.token)
        }
        //Fonction de lecture du token
        //jwtUtils.verifytoken(request.session.token)
            response.render('pages/index', {messages :[]})//renvoyer une page
        }
          messages.forEach( func = function(element) {
            if (mess == element.row.username){
                callback(element)
            }
          })
          if (user.row){if (passw){
          bcrypt.compare(passw, user.row.password,function(err, res) {
                if(res) {
                    callback2(1,"login réussi")
                    
                } else {callback2(0,"Mot de passe non valide")
                } 
              })}else{callback2(0,"Utilisateur non trouvé")}
            }else{callback2(0,"Mot de passe incorrect")}
              
          
    
    })

    
})

http.listen(8080)//ecouter le serveur//app.listen