Clarifai = require('clarifai');


//configuration 
const app = new Clarifai.App({
    apiKey: process.env.API_KEY;
   });

const handleApiCall = (req, res) => {
    const { input } = req.body;
   app.models
    .predict(Clarifai.FACE_DETECT_MODEL, input)
    .then(data => {
        res.json(data);
    }).catch(err => res.status(400).json("Unable to work with API"));
}

const rankHandler = (req, res, database) => {  
    const {id} = req.body;
    database('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err =>{
            res.status(404).json("No entries for the users");
        });
}

module.exports = {
    rankHandler:rankHandler,
    handleApiCall,
}