const bcrypt = require('bcrypt');
const user = require('../models/user');
const patientModel = require('../models/patient');
const staffModel = require('../models/staff');
var jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRegister = async (req, res) => {
  const { userid, pwd } = req.body;
  if (!userid || !pwd)
    return res
      .status(400)
      .json({ message: 'Prihlasovacie číslo a heslo sú povinné.' });

  try {
    if (await user.userExists(userid)) {
      return res.status(409).json({ message: `Already exists` });
    } else if (await user.userExistsInDB(userid)) {
      return res.status(409).json({
        message: `Nenašiel sa používateľ s týmto prihlasovacím číslom.`,
      });
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          return next(err);
        }

        bcrypt.hash(pwd, salt, function (err, hash) {
          if (err) {
            return next(err);
          }

          let body = req.body;
          body.userid = userid;
          body.pwd = hash;

          user.insertUser(body);
          return res.status(200).json({ success: `Používateľ vytvorený` });
        });
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleLogin = async (req, res) => {
  const { userid, pwd } = req.body;
  if (!userid || !pwd)
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });

  if (!(await user.userExists(userid))) return res.sendStatus(401); //Unauthorized

  const foundUser = await user.getUserByUserId(userid);
  const match = await bcrypt.compare(pwd, foundUser.PASS);
  if (match == true) {
    const patient = await patientModel.getPatientById(userid);
    const staff = await staffModel.getStaffById(userid);
    let hospital_id = null;
    let medical_role = null;
    if (patient) {
      hospital_id = patient.HOSPITAL_ID;
    } else if (staff) {
      hospital_id = staff.HOSPITAL_ID;
      medical_role = staff.MEDICAL_WORKER_ROLE_CODE;
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          userid: foundUser.USER_ID,
          role: medical_role,
          hospital: hospital_id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '3600s' }
    );

    const refreshToken = jwt.sign(
      { userid: foundUser.USER_ID },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    user.updateUserRefreshToken({
      userid: foundUser.USER_ID,
      refresh_token: refreshToken,
    });

    res.cookie('jwt', refreshToken, { httpOnly: true }); //1 day httponly cookie is not available to javascript
    res.status(200).json({ accessToken }); //store in memory not in local storage
  } else {
    res.status(409).json({ message: 'Passwords not matching' });
  }
};

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;
  // Is refreshToken in db?
  const foundUser = await user.getUserByRefreshToken(refreshToken);
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true }); // vymazat sameSite, secure ak budu bugy
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  user.updateUserRefreshToken({
    userid: foundUser.USER_ID,
    refresh_token: null,
  });

  res.clearCookie('jwt', { httpOnly: true });
  res.sendStatus(204);
};

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const foundUser = await user.getUserByRefreshToken(refreshToken);
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.USER_ID !== decoded.userid) return res.sendStatus(403);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          userid: foundUser.USER_ID,
          role: foundUser.ROLE,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '3600s' }
    );
    res.json({ accessToken });
  });
};

module.exports = {
  handleRegister,
  handleLogin,
  handleLogout,
  handleRefreshToken,
};
