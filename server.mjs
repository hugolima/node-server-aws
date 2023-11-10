import express  from 'express'
import * as pg from 'pg'

const { Pool } = pg.default
const pool = new Pool({
  user: 'postgres',
  host: 'database-pos-ceub.c7fouuzhnnjw.us-east-2.rds.amazonaws.com',
  database: 'postgres',
  password: 'pos-ceub',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
})

const app = express()
const port = 3000

app.use(express.json())

app.get('/usuarios', async (req, res) => {
  console.log('Conectando ao banco database-pos-ceub')
  const client = await pool.connect()

  try {
    const lista = await client.query('SELECT * FROM Usuario')
    res.send(lista.rows)
  } finally {
    client.release();
  }
})

app.post('/usuarios', async (req, res) => {
  console.log('Conectando ao banco database-pos-ceub')
  const client = await pool.connect()
  const usuario = req.body;

  try {
    await client.query('BEGIN')
    const queryText = 'INSERT INTO Usuario(nome, sexo, idade) VALUES($1, $2, $3) RETURNING id;'
    const res = await client.query(queryText, [usuario.nome, usuario.sexo, usuario.idade])
    const idRetorno = res.rows[0].id
    await client.query('COMMIT')

    res.send({
      id: idRetorno,
    });
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
})

app.listen(port, () => {
  console.log(`Aplicação executando na porta ${port}`)
})
