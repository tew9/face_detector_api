const RegisterHandler = ((req, res, database, bcrypt) =>{
    const {email, password, name} = req.body;
    if(!email || !name || !password){
       return res.status(400).json("Incorrect form submitted");
    }

    const hash = bcrypt.hashSync(password);

     database.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(logEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    name: name,
                    email: logEmail[0],
                    joined: new Date(),
                })
                .then(response =>{
                    res.json(response[0])
                })
                .catch(err =>{
                    res.status(404).json("Registration Failed");
                });
        })
        .then(trx.commit)
        .catch(err =>{
            trx.rollback
            res.status(404).json("Unable to register")
        })
     })
})

module.exports = {
    RegisterHandler: RegisterHandler,
};