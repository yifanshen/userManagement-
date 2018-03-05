This is a full stack web application. Swagger is applied for REST API design. A js "DB" was created to provide the database service. The backend is implemented with express.js and the fronted is implemented with react.js. It uses the proxy module to connect the backend and frontend. Basic CRUD operations are implemented. Some bugs exist and need to be correct. Wish this structure could be helpful somehow. 


Install server and client dependencies

```
yarn
cd client
yarn
```

To start the server and client at the same time

```
yarn dev
```

## How this works

The key to use an Express backend with a project created with `create-react-app` is on using a **proxy**. We have a *proxy* entry in `client/package.json`

``` 
"proxy": "http://localhost:5000/"
```

This tells Webpack development server to proxy our API requests to our API server, given that our Express server is running on **localhost:5000**


