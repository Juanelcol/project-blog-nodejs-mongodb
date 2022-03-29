const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const admin = require('./routes/admin')
const usuarios = require('./routes/usuario')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
const MONGO = 'mongodb+srv://juanelcol:c4qwp2@cluster0.a47av.mongodb.net/freecode_db?retryWrites=true&w=majority'

app.use(session({
  secret: "cursonode",
  resave: true,
  saveUninitialized: true
}))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.engine('handlebars', engine({runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true}}));
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')))
app.use('/admin', admin)
app.use('/usuarios', usuarios)
/*app.use((req, res, next) => {
    console.log("Oi middleware")
    next()
})*/

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Conectado com sucesso!")
}).catch((err) => {
    console.log("Erro ao conectar" + err)
})

app.get('/', (req, res) => {

    Postagem.find().populate('categoria').sort({data: 'desc'}).then((postagens) => {
        res.render('index', {postagens: postagens})
    })
    
})


const PORT = 8001
app.listen(PORT, ()=>{
    console.log("Servidor rodando na porta: " + PORT)
})
