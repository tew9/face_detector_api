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
        }).catch(err => res.status(400).json("Unable to Register"))
        .then(trx.commit)
        .catch(trx.rollback)
     });
})

module.exports = {
    RegisterHandler: RegisterHandler,
};