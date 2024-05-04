# API

All endpoints are prefixed with `/v1`.

### Public

The following routes are available to anyone (including unauthenticated users):

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

The following routes requires an admin access token in the body of the request:

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