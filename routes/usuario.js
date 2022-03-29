const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const flash = require('connect-flash')
const bcrypt = require('bcryptjs')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

router.get('/registro', (req, res) => {
  res.render('usuarios/registro')
})

router.post('/registro', (req, res) => {
  var errors = []
console.log(req.body)
  if(req.body.nome = "" || typeof req.body.nome == undefined || req.body.nome == null){
    errors.push({texto: 'nome inválido'})
  }
   if(req.body.email = "" || typeof req.body.email == undefined || req.body.email == null){
    errors.push({texto: 'email inválido'})
  }
   if(req.body.senha = "" || typeof req.body.senha == undefined || req.body.senha == null || req.body.senha.length < 6){
    errors.push({texto: 'senha inválida ou muito curta'})
  }
  /*if(req.body.senha != req.body.senha2){
    errors.push({texto: "as senhas são diferentes"})
  }*/
  if(errors.length > 0){
    res.render('usuarios/registro', {erro: errors})
  } else {
    Usuario.findOne({email: req.body.email}).then((Usuario) => {
      if(Usuario){
        req.flash('error_msg', 'Usuário já existe')
        res.redirect('usuarios/registro')
      } else {
        const novoUsuario = {
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha
        }

        bcrypt.genSalt(10, (erro, salt) => {
          bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
            if(erro){
              req.flash('error_msg', 'Houve um erro durante o salvamento')
              res.redirect('/')
            }
            novoUsuario.senha = hash

            new Usuario(novoUsuario).save()
          })
        })
      }
    })
  }
  console.log(errors)
})



module.exports = router