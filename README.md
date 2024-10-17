# Task Management Backend

A full-featured to-do list API with user authentication, CRUD functionality, real-time chat, file uploads, and more.

A Node.js project, built by leveraging.
1. ```Mongoose``` to create connection between mongoDB and nodejs.
2. ```Helmet``` controls DNS prefetching, avoids MIME sniffing, prevents XSS attacks and so on.
3. ```Morgan``` to log HTTP requests and errors.
4. ```Ratelimit```  help protect applications from malicious attacks, such as brute force and denial-of-service (DoS) attacks. Helps enforce usage limits.
5. ```Redis``` and ```Etags``` for caching purpose
6. ```Socket.io``` for realtime communication.
7. ```Jest``` for testing.

## Create following environment files
``.env``
``.env.development``
``.env.production``
``.env.test``


## Installation

Download the repository
```bash
git clone https://github.com/murtazavadnagar/task-management-backend.git
```

Enter folder path
```bash
cd task-management-backend
```

To install packages
```bash
yarn
```

To run development process
```bash
yarn start-dev
```

To run production process
```bash
yarn start-prod
```

To run test scripts
```bash
yarn test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)