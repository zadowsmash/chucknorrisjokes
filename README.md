# chucknorrisjokes

A fun server-less app to send random Chuck Norris Jokes and images on a schedule to subscribed users via email.

## The site is live and is in beta testing phase.

Access it at the following URL:

[chuck-norris-random-daily-jokes.net](https://chuck-norris-random-daily-jokes.net/)

## Open Source API's / NPM Modules used for the site.

  * [Chuck Norris Joke API](https://api.icndb.com/jokes/random/)
  * [g-i-s](https://www.npmjs.com/package/g-i-s)

### Usage

* Users subscribe their email address via S3 website and email address is written to a DynamoDB table and a confirmation email is received.

* CloudWatch triggers a daily job to execute the backend lambda function to send the random joke/image to subscribed users within the DynamoDB table.

* Users able to unsubscribe from the list if they choose to and will receive a confirmation email.


#### To Do

* Monitor / Filter out unrelated images

### Infrastructure Design


![Infrastructure Design](https://s3-ap-southeast-2.amazonaws.com/chuck-norris-jokes/img/chuck-norris-random-daily-jokes.net_infrastructure.png "Infrastructure Design")
