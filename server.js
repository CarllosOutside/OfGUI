const express = require('express')

const app = express()

app.use(express.static('build'));


app.listen(
    process.env.PORT || 3000, (err) =>{
        if(err){return console.log(err)}

        console.log("Ook")
    }
)

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });