# challengeDamian
---

Challenge de Sergio Damian Echevarria - damian@avalith.com

### Instalación

El proyecto necesita las siguientes tecnologias instaladas para funcionar:

* NodeJS (Version utilizada: v8.12.0)
* MySQL
* Redis

#### NodeJS

Hay diferentes alternativas para instalar NodeJS dependiendo el sistema operativo donde se quiera utilizar el sistema. Las diferentes descargas se encuentran en el siguiente enlace:

[Descargar NodeJS](https://nodejs.org/en/download/)

Ademas de los instaladores, existen otros metodos de instalación como por ejemplo el package manager del sistema operativo. Por ejemplo, en Debian/Ubuntu el metodo de instalacion es el siguiente:

```sh
# Ubuntu
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Debian
curl -sL https://deb.nodesource.com/setup_8.x | bash -
apt-get install -y nodejs
```

[Distribuciones binarias de NodeJS](https://github.com/nodesource/distributions/blob/master/README.md)

Al instalar NodeJS, tambien instalara NPM que se utilizara para instalar las dependencias del proyecto.

#### MySQL

Para poder usar el sistema, debera tener corriendo un servidor de MySQL con sus tablas correspondientes. Para instalar un servidor de MySQL, existen diferentes metodos dependiendo el sistema operativo. En Windows, el metodo mas sencillo es utilizar el MySQL Installer que permite instalar las diferentes herramientas de MySQL incluyendo MySQL Server:

[Descargar MySQL Installer](https://dev.mysql.com/downloads/installer/)

Si prefiere instalar solamente MySQL server o se encuentra en otro sistema operativo, puede descargarlo en el siguiente enlace seleccionando el sistema operativo que corresponda:

[Descargar MySQL Server](https://dev.mysql.com/downloads/mysql/)

Al igual que NodeJS, tambien existe la alternativa de instalarlo via el package manager. Por ejemplo en Debian/Ubuntu, los comandos para instalar MySQL Server son los siguientes:

```sh
# Agregar el repositorio APT de MySQL, elegiendo la version del paquete a instalar.
sudo dpkg -i /PATH/version-specific-package-name.deb
sudo apt-get update
# Instalar MySQL Server
sudo apt-get install mysql-server
```

[Guia de utilizacion del repositorio APT de MySQL](https://dev.mysql.com/doc/mysql-apt-repo-quick-guide/en/)

En la sección de **"Migraciones de Base de datos"** se explicara como crear las tablas del sistema con Knex.

#### Redis

Para descargar e instalar Redis, en Linux ejecute los siguientes comandos:

```sh
wget http://download.redis.io/releases/redis-5.0.4.tar.gz
tar xzf redis-5.0.4.tar.gz
cd redis-5.0.4
make
```

Si esta utilizando Windows, puede utilizar el port mantenido por Microsoft. Descargue el instalador del siguiente enlace y siga las instrucciones:

[Redis para Windows](https://github.com/MicrosoftArchive/redis/releases)

#### Modulos npm

Antes de poder ejecutar el proyecto, debe instalar las dependencias del proyecto. Para eso, ejecute el siguiente comando de NPM (Si instalo correctamente NodeJS deberia tambien tener NPM):

```
npm install
```

### Configuración inicial

En el directorio **"config"** se encuentra un archivo llamado **"default.js"** que contiene un modelo de las configuraciones que existen en el sistema. Lo primero que se debe hacer es crear un archivo en el mismo directorio con el nombre **"config.js"** usando el modelo como ejemplo. A continuacion se detallan cada uno de los valores configurables:

* **port:** Puerto de la API.
* **mysql:** Configuraciones de la conexion con MySQL.
    * **host:** Dirección del servidor.
    * **user:** Nombre de usuario.
    * **password:** Contraseña.
    * **database:** Base de datos a conectar.
    * **connectionLimit:** Conexiones maximas del pool de conexiones.
* **redis:** Configuraciones de la conexion con Redis.
* **nodemailer:** Configuraciones del servicio de email Nodemail.
* **tokenTime:** Tiempo de expiracion de los tokens en segundos.
* **resetTime:** Tiempo de expiracion de los codigos de reseteo de contraseñas.

### Migraciones de Base de datos

El proyecto tiene configurado migraciones de base de datos realizadas en la herramienta Knex en el directorio **"migrations"**. Para poder utilizarlas, debera tener instalados los dependencias de desarrollo o tener instalado el modulo Knex de manera global con el siguiente comando:

```
npm install knex -g
```

Luego de instalar el modulo, deberá configurar el archivo **"knexfile.js"** para indicar a que base de datos se desea hacer las migraciones. Para saber mas sobre como configurar el archivo, puede acceder a la documentacion del modulo:

[Como configurar el archivo knexfile](https://knexjs.org/#knexfile)

Puede hacer la migración con el siguiente comando de npm:

```
npm run migrate_latest
```

Si desea hacer un rollback, ejecute el siguiente comando:

```
npm run migrate_rollback
```

Si desea saber mas sobre las migraciones en Knex, puede consultar la documentacion en el siguiente enlace:

[Migraciones con Knex.js](https://knexjs.org/#Migrations)

### Funcionamiento del sistema

Para poder iniciar el sistema, ejecute el siguiente comando:

```
npm start
```

Si todo fue configurado correctamente, la API deberia estar corriendo en el puerto que previamente se configuro. Los diferentes endpoints del sistema estan documentados en OpenAPI en el directorio **"documentation"**.

El proyecto esta dividido en los siguientes directorios:

* **config:** Archivos de configuracionn del sistema.
* **documentation:** Documentacion del sistema en OpenAPI.
* **entity:** Contiene los controladores y queries de cada endpoint
* **helper:** Funciones utiles que pueden ser reutilizadas a lo largo del sistema.
* **middleware:** Contiene los middlewares por donde atraviesan las peticiones antes de llegar a los controladores.
* **migrations:** Scripts de Knex para poder realizar las migraciones de base de datos del sistema.
* **service:** Functiones para poder utilizar los servicios de email, cache y base de datos.
* **test:** Scripts con las pruebas unitarias de las funciones del sistema.

La mayoria de las llamadas disponibles requieren la utilizacion de un token valido. Para obtener este token, tiene que utilizar la llamada **/login** con un email y password correspondientes a un usuario en el sistema. El cuerpo de la solicitud es el siguiente:

```json
{
    "email": "test@email.com",
    "password": "password" 
}
```

Si el login es exitoso, la respuesta seria la siguiente:

```json
{
  "data": {
    "user": {
      "id": 201092,
      "type": 1,
      "responsability": 1
    },
    "access_token": "gwdy89GDHDNepBDNoi231BlaD2aVerihu3"
  },
  "user": {
    "fullname": "Usuario Test",
    "email": "test@email.com",
    "id": 201092,
    "type": 1,
    "responsability": 1
  },
  "access_token": "gwdy89GDHDNepBDNoi231BlaD2aVerihu3"
}
```

La propiedad **access_token** contiene el token que debera utilizar para poder usar las llamadas que requieran autorización, enviandolo en el header **Authorization** de la siguiente manera:

```
Authorization:
Bearer gwdy89GDHDNepBDNoi231BlaD2aVerihu3
```

### Tests unitarios

El proyecto tiene definidos scripts en el directorio **"test"** para hacer pruebas unitarias. Se utilzan los modulos mocha, chai y sinon y deberan estar instalados para poder ejecutar las pruebas (Estan incluidos en las dependencias de desarrollador). Para ejecutar las todas las pruebas, ejecute el siguiente comando:

```
npm run test
```

Tambien puede acotar las pruebas a ejecutar con el nombre del directorio, por ejemplo se desea solo probar las entidades puede ejecutar:

```
npm run test_entity
```

Si desea saber mas sobre el funcionamiento de Mocha, Chai y Sinon, puede ver sus respectivas documentaciones aqui:

[Mocha](https://mochajs.org/)
[Chai](https://www.chaijs.com/)
[Sinon](https://sinonjs.org/)