const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const path = require('path');
//ficura primo z node core, neni potreba nic instalovat. Slouzi spojovani cest u dirname atd viz nize

console.log(path.join(__dirname, '../public'));
//__dirname je cesta k adresari, kde je spustitelny soubor, tady app.js
//dostane me do adresare public, pouzije k tomu fci z path

app.set('view engine', 'hbs')
//nainstalovan hbs package

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));
//nastaveni statickeho adresare, v nem je css, client JS, img apod

const viewsPath = path.join(__dirname, '../templates/views')
app.set('views', viewsPath)
//aby node vedel, kde hledat ty stranky k zobrazeni, je potreba mu to takhle rict
// v tom jsou podstranky v templates/homehbs apod

const partialsPath = path.join(__dirname, '../templates/partials')
hbs.registerPartials(partialsPath)
//takto nastavim cestu k partials a reknu hbs, kde to hledat a aby to pouzil, pozor na partailsPath a registerPartials
//nodemon app.js -e js,hbs a by sledovali zmeny v hbs 

app.get('/', (req,res) => {
    res.render('index', {
        title: 'Index',
        name: 'Steni Pi'
    })
})

app.get('/about', (req,res) => {
    res.render('about',{
        title: 'about page'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        message: 'Hi, mate',
        title: 'Help page'
    })
})

app.get('/product', (req, res) => {
    res.send({
        products: []
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }
//musi byt zadana adresa jako query string, jinak posle zpatky error

    geocode(req.query.address, (error, { latitude, longitude, location } = {} ) => {
        if (error) {
            return res.send({ error })
        }
//modul geocode, poslu do nej adresu jako query string, prijde mi bud chyba, nebo objekt, ze ktereho si pres destructuring
//vezmu lat, long a loca, kdyz nastane chyba, kod se zastavi (return) a vrati tu chybu
//prazdny objekt tam je proto, aby kdyz je chyba v adrese, tak program nehasil chybu, ze nemuze udelat destructuring
//z niceho, takhle ho dela z prazdneho objektu jako defaultniho argumentucd
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
//modul forecast, poslu do nej data, ktera jsem ziskal z predchozi fce a prijde mi bud chyba, nebo obj forecastData
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('help404',{
        message: 'Errrrrrorrr'
    })
})


app.get('*', (req,res) => {
    res.render('404',{
        message: 'Errrroooooorrrr'
    })
})






app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})