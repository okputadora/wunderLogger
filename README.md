# wunderLogger

This a simple node application with configuration for deployment to
AWS as an AWS Lambda function.

The application pings the Weather Underground database every hour
to get the 10-day hourly forecast aqnd then saves that forecast in a database
which can then be retrieved by the main weather-analysis application to check
their accuracy.
