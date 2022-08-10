<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
yarn install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```
4. Levantar la base de datos
```
docker-compose up -d
```
5. Clonar el archivo __env.example__ y renombrar la copia a __.env__ y poner los valores correspondientes.
6. Levantar el proyecto en dev
```
yarn start:dev
```
5. Poblar la base de datos

```
http://localhost:3000/api/v2/seed
```

# Production build

1. crear el archivo __.env.prod__
2. Llenar las variables de entorno de prod, cambiar el localhost de la variable de mongo por el nombre del contenedor de mongo (ver en el docker compose prod)
3. Crear la nueva imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build

```

# Stack utulizados
* Nest js
* Mongo DB
* Docker
* TS
