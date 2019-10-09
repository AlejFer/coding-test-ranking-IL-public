const port = 8080;
const express = require('express');
const api = express();
const controller = require('./controller');

api.get('/', (req, res) => {
    res.send("Hola");
})
api.get('/api/private/rate_ads', controller.rateAds);
api.get('/api/private/low_scores', controller.lowScores);
api.get('/api/ads', controller.ads);

api.listen(port, () => {
    console.log(`Listening to http://localhost:${port}`);
});