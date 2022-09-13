const multer = require('multer');

//Dictionnaire ajouté pour gérer l'extension
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png"
}

//Enregistrement des images en local
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    filename: (req, file, callback) =>{
        //On enlève les espaces des noms originaux des fichiers, on y ajoute la date de l'upload, puis on ajoute l'extension grâce au dictionnaire
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage}).single("image");