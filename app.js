const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const MONGO = 'mongodb+srv://juanelcol:c4qwp2@cluster0.a47av.mongodb.net/freecode_db?retryWrites=true&w=majority'

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')))
app.use('/admin', admin)
app.use((req, res, next) => {
    console.log("Oi middleware")
    next()
})

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Conectado com sucesso!")
}).catch((err) => {
    console.log("Erro ao conectar" + err)
})




const PORT = 8001
app.listen(PORT, ()=>{
    console.log("Servidor rodando na porta: " + PORT)
})
