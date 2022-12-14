const express=require('express')
const router=express()
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb://127.0.0.1:27017'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
	const db = client.db('mean')
  const quotesCollection = db.collection('quotes') 

router.set('view engine', 'ejs')

  router.get('/', function(req, res){
    db.collection('quotes').find().toArray()
      .then(results => {
        res.render('index.ejs', { test: results })
      })
      .catch(error => console.error(error))
 });

 router.post('/quotes', (req, res) => {
    quotesCollection.insertOne(req.body)
      .then(result => {
        res.redirect('/')
      })
      .catch(error => console.error(error))
  })
router.get('/:name',(req,res)=>{
  db.collection('quotes').find({name:req.params.name}).toArray()
      .then(results => {
        res.render('edit.ejs', { test: results })
      })
      .catch(error => console.error(error))
})

router.post('/update', (req, res) => {
  quotesCollection.findOneAndUpdate(
    { name: req.body.name },
    {
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    },
    {
      upsert: true
    }
  )
    .then(result => res.redirect('/'))
    .catch(error => console.error(error))
})

router.get('/delete/:name',(req,res)=>{
  db.collection('quotes').deleteOne({name:req.params.name})
      .then(results => {
        res.redirect('/')
      })
      .catch(error => console.error(error))
})

})

.catch(error => console.error(error))

module.exports=router