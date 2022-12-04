//Import Express
const express = require('express');
//Configure Express App
const app = express();
//Configure CORS
const cors = require('cors');
//Configure Body Parser
var bodyParser = require('body-parser');
//Configure Service Account Credentials
const serviceAccount = require('./serviceAccountKey.json');
//Configure app with body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Configure app with CORS
app.use(cors());
//Configure firebase admin
const admin = require('firebase-admin');
const emailExistence = require('email-existence')
//Initilaze firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
//Accessing auth from admin sdk
const auth = admin.auth();

//API's
//Create User
app.post('/isAdmin',
 (req, res) =>
  {
  const { email, password } = req.body;
  if(email === 'chnouman49@gmail.com')
  {
    return res.status(200).json({ message: 'Admin' });
  }
  else
  {
    return res.status(300).json({ message: 'Not Admin' });
  }});



//Listen to port 5000
app.listen( () => {
  console.log('Server is running on port 5000');
});

//Language: javascript
//Path: nostrodamus-server\nostrodamus-server-master\src\firebaseInit.js
//Compare this snippet from index.js:
// const express = require('express');
// const app = express();
// const cors = require('cors');
// var bodyParser = require('body-parser');
// const serviceAccount = require('./serviceAccountKey.json');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cors());
// const admin = require('firebase-admin');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const auth = admin.auth();
// app.get('/isAdmin', (req, res) => {
//   const { email, password } = req.body;
//   if(email === '
app.post('/create-user', async (req, res) => {
  try {
    await auth
      .createUser({
        email: req.body.email,
        password: req.body.password,
      })
      .then((userRecord) => {
        res.status(200).json(userRecord);
      })
      .catch((error) => res.status(400).json(error));
  } catch (error) {
    throw new Error(error);
  }
});

//Delete User
app.delete('/delete-user', async (req, res) => {
  try {
    const response = await auth.deleteUser(req.query.uid);
    res.status(201).json(response);
  } catch (error) {
    throw new Error(error);
  }
});
//Update User
app.patch('/update-user-email', async (req, res) => {
  try {
    const response = await auth.updateUser(req.query.uid, {
      email: req.query.email,
    });
    res.status(201).json(response);
  } catch (error) {
    throw new Error(error);
  }
});
app.post('/checkemail', async (req, res) => {
  try {
    const { email } = req.body;
    emailExistence.check(email, function (error, response) {
      if (response) {
        res.status(200).json({ message: 'Email exists' });
      } else {
        res.status(400).json({ message: 'Email does not exist' });
      }
    }
    );
  } catch (error) {
    throw new Error(error);
  }
}
  )
//Server
app.get('/appcheck', (req, res) => {
  console.log('App is running');
  res.status(200).json({ message: 'App is running' });
});
  
app.listen(process.env.PORT||5000, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
