var express = require('express');
var bodyParser = require('body-parser');
var express = require('express');
var cors = require('cors');
var router = require('./routes');

var app = express();

app.use(cors());

// Parse incoming requests data
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));
app.use(router);

var PORT = 9099;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
