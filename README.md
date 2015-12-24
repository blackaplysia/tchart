# Career Chart for T* People

## INSTALLATION

### 1. Clone this repository and install by npm

```bash
$ git clone https://github.com/blackaplysia/tchart.git
$ cd tchart
$ npm install # you may belong to sudoer group
```

### 2. Create a classifier by IBM Watson Natural Language Classifier (NLC)

* Enter the root directory and create ./local directory.
* Create twitter user timeline data in ./local/twitter_${screen_name}.txt . (cf. twitter search with 'from:screen_name since:YYYY-MM-DD until:YYYY-MM-DD' and scraper for chrome)
* Create training data csv into ./local/training.csv .
```bash
$ ./create-training-data
```
* Create a classifier instance.
```bash
$ cf create-service natural_language_classifier standard tchart
$ cf create-service-key tchart credentials
$ cf service-key tchart credentials
{
 "password": "{password}",
 "url": "https://gateway.watsonplatform.net/natural-language-classifier/api",
 "username": "{username}"
}

# Create a classifier
$ curl -s -u "{username}:{password}" -X POST -F training_data=@local/training.csv -F training_metadata="{\"language\":\"ja\",\"name\":\"tchart\"}" https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers

# Wait until status of the classifier become 'available'
$ curl -s -u "{username}:{password}" https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/{classifier_id}
```

### 3. Get twitter api key

Get the twitter api key from https://apps.twitter.com/ .

* Consumer Key (API Key)
* Consumer Secret (API Secret)
* Access Token
* Access Token Secret

### 4. Set environment variables

This application needs six environment variables and you can find the sample in ./template_run.sh .

| variable | value |
|---|---|
|TWITTER_KEY|"{TWITTER_KEY_HERE}"|
|TWITTER_SECRET|"{TWITTER_SECRET_HERE}"|
|TWITTER_TOKEN|"{TWITTER_ACCESS_TOKEN_HERE}"|
|TWITTER_TOKEN_SECRET|"{TWITTER_ACCESS_TOKEN_SECRET_HERE}"|
|WATSON_NLC_CREDENTIAL|"{WATSON_NLC_USER_HERE}:{WATSON_NLC_PASSWORD_HERE}"|
|WATSON_NLC_CLASSIFIER|"{WATSON_NLC_CLASSIFIER_ID_HERE}"|

### 5. Start a server

Start a server with app.js .

```bash
$ node app.js
```

And you can find your career chart by http://localhost:3000/chart/{twitter-screen-name} .