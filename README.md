# AppRunner

Demonstrate App Runner

## Deploy CDK

```
yarn cdk:deploy
...

// test
curl https://xxx.us-west-2.awsapprunner.com

```

## Run server locally

```
cd server
yarn start
```

## Run server with docker

```
docker build . -t tsexpress
// Runs app as ts-app
docker run -d -p 8000:8000 --name ts-app tsexpress
// request
curl 127.0.0.1:8000
// Access docker container
docker exec -it {dockerid} /bin/sh

// kill
docker kill {dockerid}
```
