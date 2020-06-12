# Endpoints

GET http://localhost:5000/  *get all the todos*

GET http://localhost:5000/api  *test api route*

POST http://localhost:5000/api/login  *login route to get access and refresh token*
{
  username: "deepak"
}

**Protected Routes** 

POST http://localhost:5000/api/posts *Add new todo*
{
  Authorization: "Bearer *access token*"
}

PUT http://localhost:5000/api/posts/:id *Update exiting todo*
{
  Authorization: "Bearer *access token*"
}

DELETE http://localhost:5000/api/posts/:id *Delete a todo*
{
  Authorization: "Bearer *access token*"
}

DELETE http://localhost:5000/api/logout *Logout*
{
  Authorization: "Bearer *access token*"
}

Once logged in, request should have Access and Refresh token. Access token is valid for 60s. Once expired, new token is generated through refresh token.

**All the test cases for protected routes are set to expect 403 since dummy access token is given. Change it to valid access token and the should statement to 200. Remove the commented lines if valid access token is used then run the tests**