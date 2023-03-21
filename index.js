
//Qui vengono importate le librerie e viene configurato EJS (Embedded JavaScript) per la creazione di pagine web dinamiche
const express = require('express');
const path = require('path');
const useragent = require('express-useragent');
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Qui vengono impostate le configurazioni di base per Express (Lasciale così per evitare problemi)
app.use(useragent.express());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Con questo assegnamento viene impostato il file di configurazione globale (accessibile in ogni file backend del sito)
global.config = require('./websiteconfig.json');

// Qui creo la route per la pagina principale del sito. il file si trova in routes/index.js
const indexRouter = require('./routes/index');
app.use('/', indexRouter); // <-- Questa è la route principale del sito (http://localhost:3000/)


// 404 error
app.use(function(req, res, next) {
  res.status(404).send('Not found'); // <-- Questa è la route per la pagina 404
});


const http = require("http").createServer(app)  // Inizializzazione della libreria HTTP per la creazione di un server web

http.listen(global.config.port, function () { // Qui viene impostato il numero di porta su cui il server deve funzionare si trova nel file websiteconfig.json inizializzato sulla riga 18
  console.log('Server is running on port ' + global.config.port);
})

global.io = io = require('socket.io')(http, { // Inizializzazione della libreria Socket.io per la creazione di una comunicazione realtime tra il server e il client
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

var Particle = require('particle-api-js');  // Inizializzazione della libreria Particle per la comunicazione con il photon
var particle = new Particle(); 
setInterval(() => {
  particle.getVariable({ deviceId: 'ID DEL PHOTON CHE SI trova sul sito', name: 'VARIABILE DA LEGGERE SCRITTA SUL CODICE NEL CLOUD', auth: "TOKEN PER L'ACCESSO AL CLOUD" }).then(function(data) {
        global.io.emit('ping', { // Invia il valore letto dal photon a tutti i client connessi
            val: data.body.result != undefined ? data.body.result : 0 // Se il valore letto è undefined viene impostato a 0
        });
      }, function(err) {
        global.io.emit('ping', { // Se c'è un errore invia 0 a tutti i client connessi
            val: 0
        });
      }).catch(err => {console.log(err)});

}, 500); // Intervallo di tempo in millisecondi in cui viene letto il valore dal photon quindi vengono fatte 2 letture al secondo


var count = [];


// Qui viene impostato il numero di client connessi visibile solo da pc. il pc non viene conteggiato
global.io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      if(count.indexOf(socket.id) != -1){
        count.splice(count.indexOf(socket.id), 1);
        global.io.emit("changecount", count.length);
      }
    });
    socket.on("mobile", (data) => {
        count.push(socket.id);
        global.io.emit("changecount", count.length);
    });
});




module.exports = app;
