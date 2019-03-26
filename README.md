# chucknorrisjokes

A fun server-less app to send random Chuck Norris Jokes and images on a schedule to subscribed users via email.

## This is in very early development phase.

### Vision

* Static hosted website on S3

* Back end lambda function fetching the random jokes/images using the following API and npm module:
  * [Chuck Norris Joke API](https://api.icndb.com/jokes/random/)
  * [g-i-s](https://www.npmjs.com/package/g-i-s)


* Users subscribe their email address via S3 website and email address is written to a DynamoDB table.

* CloudWatch triggers a daily job to execute the backend lambda function to send the random joke/image to subscribed users within the DynamoDB table.

* Users able to unsubscribe from the list if they choose to.


#### To Do

* Filter out rude jokes
* Filter out unrelated images
* Front End
* Authentication between S3 static website (Front End) and Lambda backend