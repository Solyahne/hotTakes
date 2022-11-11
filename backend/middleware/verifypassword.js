const regexPassword = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;

//Ajout d'une vérification de la force du mot de passe
module.exports = (req, res, next) => {

    const password = req.body.password;
    //Si le mdp correspond, on passe à la suite
    if (regexPassword.test(password)) {
        next();
    } else {
        console.log('Error !')
    }
}; 