# bluuug 🦚
A minimalist blogging platform with a headless CMS. The project is split into 3 sub-projects:
1. `cms-api` contains the headless CMS for the platform.
2. `cms-gui` contains an example of a GUI for managing the blog platform. It is accessible only to the administrator and uses the headless CMS.
3. `blog` contains the website serves posts from the CMS.

## Features
- Headless CMS with RESTful API
- RSS feed
- API authentication using JWT
- API tested with supertest
- Blog supports comments, syntax highlighting

For more details about the features, see the respective READMEs in each folder.

## Reference
This project was done for The Odin Project [Blog API assignment](https://www.theodinproject.com/lessons/nodejs-blog-api).