# bluuug-cms-api
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?logo=node.js&logoColor=white)
![Mocha](https://img.shields.io/badge/-mocha-%238D6748?logo=mocha&logoColor=white)

A headless CMS API for bluuug.

## Features
- API versioning
- RESTful API
- User authentication with JWT
- Validation with express-validator
- Tested with supertest and mocha

## API endpoints
The API is deployed on https://bluuug-api.onrender.com/v1.

### Public
| Endpoint                                       | Meaning                                                                   |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| `GET /posts`                                   | Get the list of posts.                                                    |
| `GET /posts/?sort=<field>&order=<asc \| desc>` | Get the list of posts sorted by a field in ascending or descending order. |
| `GET /posts/[id]`                              | Get the post with ID `id`.                                                |
| `GET /posts/categories`                        | Get the list of posts' categories.                                        |
| `GET /posts/tags`                              | Get the list of posts' tags.                                              |
| `GET /comments`                                | Get all comments.                                                         |
| `GET /comments/[id]`                           | Get the comment with ID `id`.                                             |
| `GET /comments/?user=[id]`                     | Get the comments made by user with ID `id`.                               |
| `GET /comments/?post=[id]`                     | Get the comments on a post with ID `id`.                                  |
| `GET /comments/?sort=date`                     | Get all comments sorted by date.                                          |
| `GET /users`                                   | Get all users.                                                            |
| `GET /users/[id]`                              | Get the user with ID `id`.                                                |

### Protected
| Endpoint                     | Meaning                        |
| ---------------------------- | ------------------------------ |
| `POST /posts/create`         | Create a new post.             |
| `POST /posts/[id]/delete`    | Delete a post with id `id`.    |
| `POST /posts/[id]/update`    | Update a post with id `id`.    |
| `POST /comments/create`      | Create a new comment.          |
| `POST /comments/[id]/delete` | Delete a comment with id `id`. |
| `POST /comments/[id]/update` | Update a comment with id `id`. |
| `POST /users/create`         | Create a new user.             |
| `POST /users/[id]/delete`    | Delete a user with id `id`.    |
| `POST /users/[id]/update`    | Update a user with id `id`.    |

## Installation
Clone repository:
```bash
git clone git@github.com:creme332/bluuug.git
```

Navigate to API folder:
```bash
cd bluuug/cms-api
```

Install dependencies:
```bash
npm install
```

Create a `.env` file:
```
PORT=4000
MONGO_STRING=
SALT_ROUNDS=10
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN=
```

Initialize your production database:
```bash
npm run populate
```

## Usage
To run server locally in development mode:
```bash
# pwd = bluuug/cms-api
npm run dev
```
Server is deployed on `localhost:4000`.

To generate production build of server:
```bash
# pwd = bluuug/cms-api
npm run build
```

To run tests:
```bash
npm run test
```

## Reference
- https://www.youtube.com/watch?v=qy8PxD3alWw&ab_channel=ColtSteele
- https://github.com/greenroach/express-ts-template