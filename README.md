# A project trail for understanding knex + node + postgres

### Steps of setup knex node prostgres project:


1. mkdir knexjs-tutorial-2021 && npm init -y

2. npm i knex express pg 

3. npm i -D nodemon

4. touch index.js under root folder (knexjs-tutorial-2021)

5. setup node server,

```js
const express = require('express');
const router = require('./routes/routes');

const app = express();
const port = process.env.PORT || 7388;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

```

6. create a route folder and route file (routes.js), 

```js
const express = require('express');
const personController = require('../controller/person');

const router = express.Router();

router.post('/person', personController.createPerson);

module.exports = router;
```

7. create a knexfile !!!!

```js
npx knex init // check knex doc
// Then move knexfile.js into db folder !!!!
```

8. Do a knex configuration for local development,

```js
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'database_name', // eg: knexjs_tutorial
      user:     'laptop_username', // eg: damonwu
      password: null,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
};
```

9. create a database by starting postgres brew service:

```js
brew services start postgresql // based on the version you were using for postgres, example: postgresql
brew services ls // check whether postgresql service is started or not [should be eg: started username /Users/username/Library/LaunchAgents/homebrew.mxcl.postgresql.plist]
// Finally open pgadmin app to create the database locally
```

10. create a db folder and a db file (db.js) - basically setup the postgres db server connection !!!

```js
const knex = require('knex');
const knexfile = require('./knexfile'); // knexfile is the db configuration file !!!

// For PROD environment, we need to use `env vars` to config instead of directly calling knexfile.prod ...
const db = knex(knexfile.development);

module.exports = db;

```

11. DO the database initial MIGRATION,

```js
npx knex migrate:make init --migration-directory db/migrations
```

12. Create a knex schema for creating teh data model inside first migration file (`20210318101711_init.js`) !!!!

```js
exports.up = function(knex) {
  return knex.schema.createTable('person', table => {
    table.increments('id');
    table.string('email').notNullable().unique();
    table.string('first_name').notNullable(); // please use underscore instead of using camel case, avoid DB issues !!!
    table.string('last_name').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('person');
};
```

13. write data model schema into database (db knex migration !!!),

```js
npx knex migrate:latest --knexfile db/knexfile.js
// please check on your local database which should have the same knex data structure now !!!
```

14. creating a POST route in order to insert some data records !!!

  - 14.1 create a `controller` file first to talk from `routes` to `service` layer
  
  ```js
    const personService = require('../service/person');

    class PersonController {
      async createPerson(req, res) {
        try {
          const id = await personService.createPerson(req.body);
          res.status(201).json(id);
        } catch (error) {
          console.error(error);
          res.status(500).json('Oops, cannot create a new person data record, please try again later ..');
        }
      }
    }

    module.exports = new PersonController();
  ```

  - 14.2 create a `service` file to talk from `controller` to `dao (Data Access Object)` layer

  ```js
    const personDAO = require('../dao/person');

    class PersonService {
      createPerson(personDto) {
        const { firstName, lastName, email } = personDto;
        return personDAO.createPerson(firstName, lastName, email);
      }
    }

    module.exports = new PersonService();
  ```

  - 14.3 create a `dao` file to talk from `service` to `database` layer

  ```js
    const db = require('../db/db');

    class PersonDAO {
      async createPerson(firstName, lastName, email) {
        const [id] = await db('person')
          .insert({
            email,
            first_name: firstName,
            last_name: lastName,
          })
          .returning('id');

          return id;
      }
    }

    module.exports = new PersonDAO();
  ```

15. start node server `npm run dev`, and start to write a new data record to database

```js
// open postman and type: localhost:7388/person

// choose method to POST

// set body to:
// {
//     "firstName": "firstName",
//     "lastName": "lastName",
//     "email": "firstName_lastName@test.com"
// }
```

16. done !!!
