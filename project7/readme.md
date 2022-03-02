Load schema and data into database.
```bash
node loadDatabase.js
```

Developing back end (server app):
```bash
nodemon webServer.js
```

Developing front end (browser app):
```bash
node webServer.js & npm run build:w
```

Examine all processes.
```bash
lsof -i:3000
```

Kill a process (Replace [PID] with PID number, e.g. `kill -9 53021`).
```bash
kill -9 [PID]
killall node
```

___
#### Session
* How do NodeJS sessions work? [link](https://nodewebapps.com/2017/06/18/how-do-nodejs-sessions-work/)

___
#### Redux
* [React-redux](https://react-redux.js.org/introduction/quick-start)
* [Redux](https://redux-docs.netlify.com/introduction/installation)
* [Store](https://redux-docs.netlify.com/recipes/configuring-your-store)

```bash
npm install --save redux
npm install --save react-redux

rm -f images/U*

# upload
scp -r local/path/to/folder SUNetID@cardinal.stanford.edu:~/remote/path/to/folder
scp -r ~/Desktop/cs142/project1 webace@cardinal.stanford.edu:~
scp -r project7 tingyu95@myth.stanford.edu:~cs142/


# submit
/usr/class/cs142/bin/submit

# check submission is received
ls -l /usr/class/cs142/submissions/number/$USER-*
```
