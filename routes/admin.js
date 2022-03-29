const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')
const flash = require('connect-flash')



router.get('/posts', (req, res) => {
    res.send('posts')
})

router.get('/categorias', (req, res) => {
    Categoria.find().sort({data: 'desc'}).then((categorias) => {
      res.render('admin/categorias', {categorias: categorias})
    })
})

router.get('/categorias/add', (req, res) => {
  
  res.render('admin/categorias-add')
})

router.post('/categorias/nova', (req, res) => {

    var errors = []

  if(!req.body.nome || req.body.nome == undefined ||     req.body.nome == null){
    errors.push({erro: "Nome inválido"})
    console.log(errors)
  }

  if(!req.body.slug || req.body.slug == undefined ||     req.body.slug == null){
    errors.push({erro: "Slug inválido"})
    console.log(errors)
  }

  if(req.body.nome.length <= 2){
    errors.push({erro: "Nome deve ter, ao menos, três caracteres"})
    console.log(errors)
  }

  if(errors.length > 0 ){
    res.render('admin/categorias-add', {erros: errors})
  } else {
      const novaCat = {
        nome: req.body.nome,
        slug: req.body.slug
      }
      new Categoria(novaCat).save().then(() => {
        
        console.log('Categoria salva com sucesso"')
        req.flash('success_msg', 'categoria criada com sucesso')
        res.redirect('/admin/categorias')
      }).catch((err) => {
        req.flash('error_msg', 'erro ao salvar a categoria')
        })
    }
})

router.get('/categorias/edit/:id', (req, res) => {
  Categoria.findOne({_id: req.params.id}).then((categoria) => {
    res.render('admin/categorias-edit', {categoria: categoria})
  }).catch((err) => {
    req.flash('error_msg', 'erro ao editar a categoria')
    res.redirect('admin/categorias')
  })
})

router.post('/categorias/edit', (req, res) => {
  Categoria.findOne({_id: req.body.id}).then((categoria) => {
    categoria.nome = req.body.nome
    categoria.slug= req.body.slug

    categoria.save().then(() => {
      console.log('categoria editada com sucesso')
      req.flash('success_msg', 'categoria editada com sucesso')
      res.redirect('/admin/categorias')
    }).catch((err) =>{
      req.flash('error_msg', 'erro ao editar a categoria')
      res.redirect('/admin/categorias')
      console.log(err)
    })
  })
})

router.post('/categorias/delete', (req, res) => {
  Categoria.deleteOne({_id: req.body.id}).then(() => {
    req.flash('success_msg', "categoria deletada com sucesso")
    res.redirect('/admin/categorias')
  }).catch((err) => {
    req.flash('error_msg', 'erro ao deletar a categoria: ' + err)
    res.redirect('/admin/categorias')
  })
})

router.get('/postagens', (req, res) => {
  Postagem.find().populate('categoria').sort({data: 'desc'}).then((postagens) => {
    res.render('admin/postagens', {postagens: postagens})
  }).catch((err) => {
    req.flash('error_msg', 'houve um erro ao listar as postagens')
    res.render('admin/postagens') 
  })
  
})

router.get('/postagens/add', (req, res) => {
  Categoria.find().then((categorias) => {
    res.render('admin/postagens-add', {categorias: categorias})
  }).catch((err) => {
    req.flash('success_msg', 'erro ao carregar a página' + err)
    res.redirect('/admin/postagens')
  })
})

router.post('/postagens/nova', (req, res) => {
  
    var errors = []
  
  if(req.body.categoria == '0'){
    errors.push({erro: 'categoria inválida'})
  }

  if(errors.length > 0){
    res.render('admin/postagens-add', {erro: errors})
  } else {
    console.log(req.body)
    const novaPostagem = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
      slug: req.body.slug
    }
      new Postagem(novaPostagem).save().then(() => {
        req.flash('success_msg', 'postagem criada com sucesso')
                 res.redirect('/admin/postagens')
      }).catch((err) => {
        req.flash('error_msg', 'erro ao criar postagem' + err)
        res.redirect('/admin/postagens')
      })
    } 
})

router.get('/postagens/edit/:id', (req, res) => {

  Postagem.findOne({_id: req.params.id}).then((postagens) => {
    Categoria.find().then((categorias) => {
        res.render('admin/postagens-edit', {categorias: categorias, postagens: postagens})
    }).catch((err) => {
        req.flash('error_msg', 'erro ao editar postagem')
        res.redirect('/admin/postagens')
    })
  }).catch((err) => {
        req.flash('error_msg', 'erro ao editar postagem' + err)
        res.redirect('/admin/postagens')
  })
})

router.post('/postagens/edit', (req, res) => {
  
  Postagem.findOne({_id: req.body.id}).then((postagens) => {
      postagens.titulo = req.body.titulo
      postagens.slug = req.body.slug
      postagens.descricao = req.body.descricao
      postagens.conteudo = req.body.conteudo
      postagens.categoria = req.body.categoria

      postagens.save().then(() => {
        res.redirect('/admin/postagens')
      })
  }).catch((err) => {
    req.flash('error_msg', 'erro ao salvar postagem')
        res.redirect('/admin/postagens')
  })
})

router.get('/postagens/delete/:id', (req, res) => {
  Postagem.deleteOne({_id: req.params.id}).then(() => {
    req.flash('success_msg', 'postagem deletada com sucesso')
    res.redirect('/admin/postagens')
  }).catch((err) => {
    console.log(err)
  })
})

module.exports = router