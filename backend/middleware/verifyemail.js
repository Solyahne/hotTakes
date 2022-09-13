const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

//Ajout d'une vérification du format de l'adresse mail, y compris des caractères autorisés
module.exports = (req, res, next) => {

    const email = req.body.email;
    //Si l'email correspond, on passe à la suite
    if (regexEmail.test(email)) {
        next();
    } else {
        console.log('Error !')
    }
}; 