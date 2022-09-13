const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

//Ajout d'une vérification de la force du mot de passe
module.exports = (req, res, next) => {

    const email = req.body.email;

    if (regexEmail.test(email)) {
        next();
    } else {
        console.log('Error !')
    }
}; 