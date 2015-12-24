# Career Chart for T* People

## INSTALLATION

### Clone this repository and install by npm

```bash
$ git clone https://github.com/blackaplysia/tchart.git
$ cd tchart
$ npm install # you may belong to sudoer group
```

### Create a classifier by IBM Watson Natural Language Classifier (NLC)

1. Enter the root directory and create ./local directory.
2. Create twitter user timeline data in ./local/twitter_${screen_name}.txt . (cf. twitter search with 'from:screen_name since:YYYY-MM-DD until:YYYY-MM-DD' and scraper for chrome)
3. Create training data csv into ./local/training.csv .
```bash
$ ./create-training-data
```
4. Create a classifier instance.
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

### 4. Get twitter api key

Get the twitter api key from https://apps.twitter.com/ .

* Consumer Key (API Key)
* Consumer Secret (API Secret)
* Access Token
* Access Token Secret

### 5. Set environment variables

This application needs six environment variables and you can find the sample in ./template_run.sh .

| variable | value |
|---|---|
|TWITTER_KEY|"{TWITTER_KEY_HERE}"|
|TWITTER_SECRET|"{TWITTER_SECRET_HERE}"|
|TWITTER_TOKEN|"{TWITTER_ACCESS_TOKEN_HERE}"|
|TWITTER_TOKEN_SECRET|"{TWITTER_ACCESS_TOKEN_SECRET_HERE}"|
|WATSON_NLC_CREDENTIAL|"{WATSON_NLC_USER_HERE}:{WATSON_NLC_PASSWORD_HERE}"|
|WATSON_NLC_CLASSIFIER|"{WATSON_NLC_CLASSIFIER_ID_HERE}"|

### 6. Start a server

```bash
$ node app.js
```
