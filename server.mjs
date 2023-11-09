import express from 'express'

const app = express()
const port = 3000

app.use(express.json())

app.get('/usuarios', (req, res) => {
  const usuario = {
    nome: 'Hugo',
    sexo: 'M',
    idade: 44,
  }
  res.send(usuario)
})

app.post('/usuarios', (req, res) => {
  const usuario = req.body;
  console.log(usuario.nome);
  res.send();
})

app.listen(port, () => {
  console.log(`Aplicação executando na porta ${port}`)
})
