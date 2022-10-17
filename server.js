const express = require('express')

const app = express()

app.use(express.static('build'));


app.listen(
    process.env.PORT || 3000, (err) =>{
        if(err){return console.log(err)}

        console.log("Ook")
    }
)

app.get('/', (req, res, next) => {

    res.status(200).json({
        status: 'success',
        data: {
            name: 'name of your app',
            version: '0.1.0'
        }
    });

});