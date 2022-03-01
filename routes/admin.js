const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('posts')
})

router.get('/categorias', (req, res) => {
    res.render('admin/categorias')
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/categorias-add')
})

router.post('/categorias/nova', (req, res) => {
    const novaCat = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    new Categoria(novaCat).save().then(() => {
        console.log('Categoria salva com sucesso"')
    }).catch((err) => {
        console.log('erro ao salvar categoria' + err)
    })
})

module.exports = router