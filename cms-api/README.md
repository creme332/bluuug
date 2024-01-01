# bluuug-cms-api
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?logo=node.js&logoColor=white)

## Features
- API versioning
- RESTful API
- Protected endpoints with JWT
- Validation with express-validator
- Tested with supertest

## API endpoints
The API is deployed on https://bluuug-api.onrender.com/v1

> 🔴 **Note**: The `/v1` prefix is essential and indicates the stable version 1 of the API.

### Public
| Endpoint                                       | Meaning                                                                   |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| `GET /posts`                                   | Get the list of posts.                                                    |
| `GET /posts/?sort=<field>&order=<asc \| desc>` | Get the list of posts sorted by a field in ascending or descending order. |
| `GET /posts/[id]`                              | Get the post with ID `id`.                                                |
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

## Usage
To run server in development mode:
```bash
npm run dev
```
Server is deployed on `localhost:4000`.

To generate production build of server:
```bash
npm run build
```

## To-do
- [ ] API versioning

## Reference
- https://www.youtube.com/watch?v=qy8PxD3alWw&ab_channel=ColtSteele
- https://github.com/greenroach/express-ts-template