const port = 5000;
const express = require('express');
const http = require('http'); // Import the HTTP module
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = require('./configuration/cors');
const verifyJWT = require('./user_verification/verify_jwt');
const credentials = require('./user_verification/access_control_allow_credentials');

const server = http.createServer(app); // Create an HTTP server using your Express app

app.use(credentials);
app.use(cors(corsOptions)); // TODO delete if needed
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);

app.use(cookieParser());
app.use(verifyJWT);

server.listen(port, () => {
  console.log(`Hospital Information System runs on port: ${port}`);
});
