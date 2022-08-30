const { GoogleSpreadsheet } = require('google-spreadsheet')
const fs = require('fs')

const connectDB = async (index) => {
   const doc = new GoogleSpreadsheet(process.env.SPREAD_SHEET_ID)
   //credentials
   const CREDENTIALS = JSON.parse(fs.readFileSync('credentials.json'))

   await doc.useServiceAccountAuth({
      private_key: process.env.PRIVATE_KEY, //replace with key if .env fails to read
      client_email: process.env.CLIENT_EMAIL
   })

   await doc.loadInfo()

   let sheetIndex = index ? index : 0 
   const sheet = doc.sheetsByIndex[sheetIndex]

   return sheet
}

module.exports = connectDB