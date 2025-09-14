# Daily development workbook

## Date: 2025-09-12

### Goals for today

- Understand task
- Familiarise with the MERN stack![MERN stack](https://images.contentstack.io/v3/assets/blt7151619cb9560896/bltc123befc321883ff/666c2270664d45ead620f7a7/lsuggzv1y2g4km8s0-mernstack-frameworknew.png)
- Init repo
- Setup simple folder structure
- Create simple full stack MERN project to play around with (https://www.mongodb.com/resources/languages/mern-stack-tutorial)
  - Init server
  - Create MongoDB Atlas account
  - Connect to DB
  - Init client (React, TS), connect to BE

### Tasks completed

- Grasped a good understanding of the task, read about MERN and learned about Node, Express and MongoDB with ChatGPT
- Made a small app to play around with to perform basic functionalities, display and add data based on a Mongo tutorial (not related to the topic of this exercise, just for my understanding)
- Created an Atlas account and added a new cluster
- Connected server to MongoDB

### Challenges

- Learning about a new technology
- Spent a lot of time today reading and writing code, so it'll be interesting to put this knowledge into the new system
- (Mistyped cluster name on Atlas)

## Date: 2025-09-13

### Goals for today

#### BE and planning focused day

- Refactor BE to TS
- Create new BE connection on Atlas
- Setup DB
- Read about event sourcing
- Start planning!
  - Define requirements (functional/non-functional requirements)
  - Create data model
  - Mock events?

### Tasks completed

- Refactored BE to TS
- Created new cluster on Atlas with working connection
  - Created a GET endpoint and connected FE
  - Created MongoDB
- Generated data model
- Added mock data to DB

### Challenges

- Server couldn't run with `node --env-file=config.env server` and had TypeScript compilation issues. I went over with Cursor to update imports, fix TypeScript config and the DB connection.
- There were issues with getting users data, beacuse vite config removed the api prefix, deleted this line: `rewrite: (path) => path.replace(/^\/api/, "")`

## Date: 2025-09-13

### Goals for today

#### API, FE focused day

- Create Swagger API generation
- Create Wrifeframes, design ideas for Frontend
- Start implementing Frontend

### Tasks completed

- Added Swagger for API documentation
  - used third party lib `swagger-ui-express` https://stackoverflow.com/a/53834523
- Added shell to start BE, FE and API docs `./start-dev.sh`

### Challenges

-
