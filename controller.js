const data = require('./data.json');
module.exports = {
    rateAds: rateAds,
    lowScores: lowScores,
    ads: ads,
};

function rateAds(req, res) {
    // Get ads from file
    let ads = data.ads;
    let valueableWords = data.valueableWords;

    // Calculate Score for each ad
    for (let i = 0; i < ads.length; i++) {
        // get ad
        let ad = ads[i];
        // init score & flags
        let score = 0;
        let picFlag = false;
        let descFlag = false;
        let sizeFlag = false;

        // Ask for picture
        if (arePictures(ad.pictures)) {
            // When there are pictures
            picFlag = true;
            // For each picture check quality
            for (let j = 0; j < ad.pictures.length; j++) {
                if (ad.pictures[j].quality === "HD")
                    score += 20;
                else
                    score += 10;
            }
        } else {
            // When there are not pictures
            score -= 10;
        }

        // Ask for description
        if (isDescription(ad.description)) {
            // When there is description
            descFlag = true;
            score += 5;

            // Count amount of words
            let words = countWords(ad.description);

            // Check how many words there are
            if (words > 20) {
                // When more than 20 words

                if (words < 49) {
                    // when less than 49 words check if it is a FLAT type
                    if (ad.typology === "FLAT")
                        score += 10;
                }

                if (words > 50) {
                    // when more than 50 words check for type
                    if (ad.typology === "FLAT")
                        score += 30;

                    if (ad.typology === "CHALET")
                        score += 20
                }
            }

            // Check for Valueable Words
            for (let k = 0; k < valueableWords.length; k++) {
                if (isWord(ad.description, valueableWords[k]))
                    score += 5;
            }
        }

        // Check if ad is complete
        switch (ad.typology) {
            case "GARAGE":
                if (picFlag)
                    score += 40;
                break;
            case "CHALET":
                if (ad.houseSize && ad.gardenSize)
                    sizeFlag = true;
            case "FLAT":
                if (ad.houseSize)
                    sizeFlag = true;

                if (picFlag && descFlag && sizeFlag)
                    score += 40;
                break;

            default:
                score += 0;
                break;
        };

        // Save score in ad
        ad.score = score;
        ad.irrelevantSince = new Date().toString();
    }

    // Save ads
    data.ads = ads;

    res.send("Scores calclated. Ads Saved");
}

function lowScores(req, res) {
    let ads = data.ads;
    let response = [];

    for (let i = 0; i < ads.length; i++) {
        if (ads[i].score <= 40)
            response.push(ads[i]);
    }

    res.send(response.sort((a, b) => a.score - b.score));
}

function ads(req, res) {
    let ads = data.ads;
    let response = [];

    for (let i = 0; i < ads.length; i++) {
        if (ads[i].score > 40)
            response.push(ads[i]);
    }

    res.send(response.sort((a, b) => b.score - a.score));
}

// Help Tools
function arePictures(list) {
    if (list.length > 0)
        return true;
    return false
}

function isDescription(text) {
    if (text.length > 0)
        return true;
    return false;
}

function countWords(text) {
    let words = text.split(" ");
    return words.length;
}

function isWord(text, word) {
    if (text.indexOf(word) >= 0)
        return true;
    return false;
}