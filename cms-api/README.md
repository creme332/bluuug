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
- Protected endpoints with JWT
- Validation with express-validator
- Tested with Postman

## API endpoints
The API is deployed on https://bluuug-api.onrender.com/v1.

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
| Endpoint                       | Meaning                        |
| ------------------------------ | ------------------------------ |
| `POST /posts/create`           | Create a new post.             |
| `DELETE /posts/[id]/delete`    | Delete a post with id `id`.    |
| `POST /posts/[id]/update`      | Update a post with id `id`.    |
| `POST /comments/create`        | Create a new comment.          |
| `DELETE /comments/[id]/delete` | Delete a comment with id `id`. |
| `POST /comments/[id]/update`   | Update a comment with id `id`. |
| `POST /users/create`           | Create a new user.             |
| `DELETE /users/[id]/delete`    | Delete a user with id `id`.    |
| `POST /users/[id]/update`      | Update a user with id `id`.    |

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
- [ ] add limit to api get requests
- [ ] create a test database
- [ ] use update http instead of post request to update stuffs
- [ ] add api for authentication

## Reference
- https://www.youtube.com/watch?v=qy8PxD3alWw&ab_channel=ColtSteele
- https://github.com/greenroach/express-ts-template