const express = require('express')
const connectDB = require('./utils/database')
require('dotenv').config()

const main = async() => {
    const app = express()

    //middleware
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    //google sheet db
    const sheet = await connectDB(0)

    app.get('/', async (_, res) => {
        let rows = await sheet.getRows()
        let data = []

        for(let i = 0; i < rows.length; i ++ ){
            data.push({ id: i, email: rows[i].email, name: rows[i].name })
        }

        return res.status(200).json({ msg: "Hello amigos", data })
    })

    app.post('/', async(req, res) => {
        const { name, email } = req.body
     
        let newUser = { name, email, createdat: Date.now(), updatedat: Date.now() }
        await sheet.addRow(newUser)

        return res.status(200).json(newUser)
    })

    app.patch('/:name', async (req, res) =>{
        const id = req.params.name
        let { name, email} = req.body
        
        let rows = await sheet.getRows()

        for(let i = 0; i < rows.length; i ++ ){
            let row = rows[i]
            if(row['name'] === id){
              row['name'] = name
              row['email'] = email
              await row.save()
            }
        }

       return res.status(200).json({ msg: "updated user" })
    })

    app.delete("/:name", async (req, res) => {
        const id = req.params.name

        let rows = await sheet.getRows()

        for(let i = 0; i < rows.length; i ++ ){
            let row = rows[i]
            if(row['name'] === id){
              await row.delete()
            }
        }

        return res.status(400).json({ msg: "deleted user" })
    })

    // port 
    const PORT = process.env.PORT || 3001
    app.listen(PORT, ()=> {
        console.log(`Server is running on port ${PORT}...`)
    })
}

main().catch(err => console.log(err))