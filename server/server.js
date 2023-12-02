// TODO if not working - add cors
const port = 5000;
const express = require('express');
const http = require('http'); // Import the HTTP module
const app = express();
const cookieParser = require('cookie-parser');

const verifyJWT = require('./user_verification/verify_jwt');
const credentials = require('./user_verification/access_control_allow_credentials');

const server = http.createServer(app); // Create an HTTP server using your Express app

app.use(credentials);
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);

app.use(cookieParser());
app.use('/auth', require('./routes/auth_route'));
app.use('/patient', require('./routes/patient_route'));
app.use('/examination', require('./routes/examination_route'));
app.use('/staff', require('./routes/staff_route'));
app.use('/municipality', require('./routes/mucipality_route'));
app.use('/department', require('./routes/department_route'));
app.use('/prescription', require('./routes/prescription_route'));
app.use('/diagnose', require('./routes/diagnose_route'));
app.use('/drug', require('./routes/drug_route'));
app.use('/dashboard', require('./routes/dashboard_route'));
app.use('/hospital', require('./routes/hospital_route'));
app.use('/medicalRecord', require('./routes/medical_record_route'));
app.use('/medicalProcedure', require('./routes/medical_procedure_route'));
app.use('/vaccine', require('./routes/vaccine_route'));
app.use(verifyJWT);

server.listen(port, () => {
  console.log(`Hospital Information System runs on port: ${port}`);
});

// TODO generate access token and refresh token secret - delete if not needed
/* const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
console.log('Generated Secret Key:', secretKey); */
