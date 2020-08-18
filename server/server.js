//MAIN IMPORTS
const express = require('express');
const app = express();
const cors = require('cors');

//MIDDLEWARES
app.use(cors());
app.use(express.static('public'));

//MULTER
const multer = require('multer');

//STORAGE ENGINE
const storage = multer.diskStorage({
  destination: "uploaded", /* Must Exist */
  filename: (req, file, cb) => {
    const fieldname = file.fieldname;
    const extension = file.mimetype.split("/")[1] || "";
    const prefix = Date.now();
    const destFileName = fieldname + "-" + prefix + "." + extension;
    // console.log(destFileName);
    console.log(req.body.fullname);
    cb(null, destFileName);
  }
});


//UPLOAD ENGINE
const upload = multer({
  storage: storage,
  /* 
    The Filter Runs for every single file in the upload engine, operation either collectively succed or fails (atomic). 
    Being a middleware, it can definitely affect req.body of elements coming before it (Order matters 😀).
  */
  fileFilter: (req, file, cb) => {
    // console.log("\n⭐ YET A NEW FILE UPLOADED ⭐\n");
    // console.log(file.mimetype);
    if (!file.mimetype.includes('image')) cb(new Error('The Server Only Accept Image Files'), false);
    else cb(null, true);
  },
  // limits: {
  //   fileSize: 2_097_152 //2MB
  // }
});


//ROUTES
app.post('/upload', upload.fields([{ name: 'images', maxCount: 8 }]), (req, res) => {
  res.send({ file: req.file, files: req.files, body: req.body });
});


//Doing Express Handling on Our Own
app.post('/upload-2', (req, res) => {
  upload(req, res, (err) => {
    if (err) res.send(err);
    else res.send("Upload Successfull");
  });
});

//SERVER
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`\n\n⚡ Listening on Port ${port}\n\n`));