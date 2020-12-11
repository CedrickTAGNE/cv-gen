const express = require('express')
var bodyParser = require('body-parser')
const generator = require('./pdf-generator')
const app = express();
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  res.send("OK");
});

app.post('/generate-cv', async (req, res) => {
  //res.send('Hello World!')
  try {
    console.log('body ',req.body)
    const template = req.body.template;
    const data = req.body.data;

    const result = await generator.createPDF(data, template);


    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-disposition': 'attachment;filename=cv_' + data.name + '.pdf',
    });
    //res.end(Buffer.from(data, 'binary'));

    // res.setHeader('Content-Length', result.size);
    /* res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cv_'+data.name+'.pdf');
    file.pipe(res); */

    console.log(result);
    res.end(result, 'binary');
  }catch(err) {
    res.sendStatus(500, err);
  }
  
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}