# Start Postgres Database
First install docker.

Build the docker image:

``` docker build -t eg_postgresql . ```

Run the docker image:

```docker run --rm -P --name pg_test -d -p 5432:5432 eg_postgresql```

## Connection for dev

Host: localhost

Port: 5432

Database: docker

User: docker

password: docker

## Problems:
When the port is already allocated: 

```netstat | grep 5432```

Get the process ID and kill the process:
```kill -9 ID```

