# Postgres y docker

Tiene la opción de instalar postgres en su máquina o crear una instancia de la base de datos usando Docker.

## Usando Docker para la base de datos

```yml
services:
  db:
    image: postgres:17
    restart: always
    environment:
      POSTGRES_DB: 'db'
      POSTGRES_USER: 'user'
      POSTGRES_PASSWORD: 'password'
    ports:
      - '5432:5432'
    expose:
      - '5432'
    volumes:
      - my-volume:/var/lib/postgresql/data

volumes:
  my-volume:
```

Para crear el contenedor ejecuta:

```sh
docker-compose up -d
```
