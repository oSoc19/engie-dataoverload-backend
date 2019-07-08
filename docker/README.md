# Start Postgres Database
First install docker.

Build the docker image:

``` docker build -t eg_postgresql . ```

Run the docker image:

```docker start pg_test -p 5432:5432 eg_postgresql```


To start the existing docker container use (this wont remove the data from the container):

```docker start pg_test```

## Connection for dev

Host: localhost

Port: 5432

Database: docker

User: docker

password: docker

## Problems:
When the port is already allocated: 

```sudo lsof -i -P -n | grep 5432```

Get the process ID and kill the process:
```kill -9 ID```

