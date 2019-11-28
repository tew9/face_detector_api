const handler = (req, res) =>{
    const {email, password, name} = req.body;
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
        .catch(trx.rollback)
     });
}

// module.exports = {
//     handler:handler;
// };