const profileHandler = (req, res, database, bcrypt) => {
    const {id} = req.params;
    
    database('users').where({id: id}).then(user =>{
        if(user.length > 0){
           res.json(user[0]); 
       }else{
           res.status(404).json("User not Found!")
       } 
    }); 
}

module.exports = {
	profileHandler: profileHandler,
};