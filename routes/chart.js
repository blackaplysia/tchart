var twitter = require('twitter');
var watson = require('watson-developer-cloud');

if (process.env.TWITTER_KEY == null ||
    process.env.TWITTER_SECRET == null ||
    process.env.TWITTER_TOKEN == null ||
    process.env.TWITTER_TOKEN_SECRET == null) {
    console.error('Must set twitter API configuration in environment variables');
    process.exit();
} else {
    var twitter_client = new twitter({
        consumer_key: process.env.TWITTER_KEY,
        consumer_secret: process.env.TWITTER_SECRET,
        access_token_key: process.env.TWITTER_TOKEN,
        access_token_secret: process.env.TWITTER_TOKEN_SECRET
    });

    console.log('Twitter key: ' + twitter_client.options.consumer_key);
    console.log('Twitter token: ' + twitter_client.options.access_token_key);
}

if (process.env.WATSON_NLC_CREDENTIAL == null ||
    process.env.WATSON_NLC_CLASSIFIER == null) {
    console.error('Must set Watson credential in environment variables');
    process.exit();
} else {
    var re_credential = /(.+):(.+)/;
    var credential = process.env.WATSON_NLC_CREDENTIAL.match(re_credential);
    var nlc = watson.natural_language_classifier({
        url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
        username: credential[1],
        password: credential[2],
        version: 'v1'
    });

    var classifier_id = process.env.WATSON_NLC_CLASSIFIER;
}

var express = require('express');
var router = express.Router();

router.get('/:account', function(req, res) {
    console.log('Account: ' + req.params.account);

    var charts = [];
    var count = 0;
    var params_timeline = { screen_name: req.params.account };
    twitter_client.get('/statuses/user_timeline.json', params_timeline, function(error, tweets, response) {
        if (error) {
            console.error('Twitter Query Error: ' + JSON.stringify(error));
            res.status(500);
            res.render('error-api', {
                api: 'Twitter timeline',
                message: error[0].message
            });
        } else {
            tweets.forEach(function(tweet) {
                var params_classify = {
                    text: tweet.text,
                    classifier_id: classifier_id
                };
                nlc.classify(params_classify, function(error, result) {
                    if (error) {
                        console.log('NLC Classification Error: ' + JSON.stringify(error));
                        res.status(500),
                        res.render('error-api', {
                            api: 'Watson NLC',
                            message: error[0].message
                        });
                    } else {
                        charts[charts.length] = {
                            name: result.classes[0].class_name,
                            confidence: result.classes[0].confidence,
                            text: tweet.text
                        };
                        count++;

                        if (count >= tweets.length) {
                            var tops = {};
                            charts.forEach(function(chart) {
                                if (chart.confidence >= 0.8) {
                                    var top = tops[chart.name];
                                    if (top != null) {
                                        tops[chart.name] = {
                                            name: top.name,
                                            sum_confidence: top.sum_confidence + chart.confidence,
                                            count: top.count + 1
                                        }
                                    } else {
                                        tops[chart.name] = {
                                            name: chart.name,
                                            sum_confidence: chart.confidence,
                                            count: 1
                                        }
                                    }
                                }
                            });

                            if (Object.keys(tops).length === 0) {
                                res.render('chart-none', {});
                                console.log('-> None (0): 0.0');
                            } else {
                                top = {
                                    name: '(none)',
                                    confidence: 0.0,
                                    count: 0
                                };
                                for (var key in tops) {
                                    confidence = tops[key].sum_confidence / tops[key].count;
                                    if (tops[key].count > top.count ||
                                        (tops[key].count == top.count && confidence > top.confidence)) {
                                        top.name = tops[key].name;
                                        top.confidence = confidence;
                                        top.count = tops[key].count;
                                    }
                                }
                                res.render('chart', { title: '進路', name: top.name, confidence: top.confidence });
                                console.log('->' + top.name + '(' + top.count + '): ' + top.confidence);
                            }
                        }

                    }
                });
            });
        }
    });

});


module.exports = router;
