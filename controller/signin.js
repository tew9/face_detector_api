const SigninHandler = (req, res, database, bcrypt) => {
    const{email, password} = req.body;
    if(!email || !password){
       return res.status(400).json("Empty info submitted");
    }
    
    database.select('*').from('login')
    .where('email', '=', email)
    .then(user => {
        const isValid = bcrypt.compareSync(password, user[0].hash) 
        if(isValid){
            database.select('*').from('users')
            .where('email', '=', user[0].email)
            .then(user_info => {
                res.json(user_info[0])
            }).catch(err => {
                res.status(400).json("Unable to grab the users")
            })
        }else{
            res.status(400).json("Wrong username and password")
        }
    }).catch(err =>{
        res.status(400).json("Wrong username or password")
    })
}

module.exports = {
    SigninHandler: SigninHandler,
}