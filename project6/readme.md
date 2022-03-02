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
