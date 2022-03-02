### Week 7
*Lectures on May 13, 15*
#### Sessions ([Sessions.pdf](Sessions.pdf))
* Not good to save in server: binding between browser and server.
* Server should be stateless.

##### Keep track of session in HTTP - Cookie (page 5)
* Cookies: receive response from server, and insert into all future requests to the save server.
* Each cookie is a key-value pair， has domain.
* Cookies are stored in HTTP header.
* Strong session state:
  - early approach: save in cookie.
  - better approach: pass pointer in cookie.
* Pros and cons of storing session state on server memory vs. memory (page 10).
  - Solution: **mem-cache**, **redic** key-value store for small, short-lived data.
  - Express solution:
    - stored in memory on web server by default.
    - Can also store in database: `require('connect-mongo')(express);` (page 13).
* Alternative to cookie (page 15): `sessionStorage`, `localStorage`.
* Express has a middleware layer to deal with session state
  - store sessionID in a cookie
  - store session state in a session state store
  - hand the creation and fetching of session state of your request handlers
  
```JavaScript
var session = require('express-session');

// sign with a secret key that ONLY developer knows
// cryptographically signing a session cookie
app.use(session({secret: 'key'}));

app.get('/user/:user_id', function (httpRequest, httpResponse) {})

// destroy session (after logout)
httpRequest.session.destroy(function (err) { });

var MongoStore = require('connect-mongo')(express);
expressApp.use(session({
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

```

#### Input ([Input.pdf](Input.pdf))
*Lecture on May 15*
* Old Way: HTTP form: can do `GET` or `POST` requests (params stored differently).
* Rail input pattern: after submitting form, can go to (1) success page; (2) retry form; (3) error.
* Validation requirement:
  - (1) can't trust users requests. Assume all are bad. Enforce a **web server API**.
  - (2) good user experience: intuitive.
  - (3) JavaScript validation in browser, inform users as early as possible (before sending requests).

```JavaScript
class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value}); // Common approach to push into component state
  }

  handleSubmit(event) {
  // Process submit from this.state
    event.preventDefault(); // Need to stop DOM from generating a POST
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
          // validate at every key stroke
          <label>
          Name: <input type="text" value={this.state.inputValue} onChange={this.handleChangeInput} />
         </label>
          <label>
           Essay: <textarea value={this.state.textValue} onChange={this.handleChangeText} />
         </label>
         <label>
         // a menu for actions
          Pick
          <select value={this.state.selValue} onChange={this.handleChangeSelect}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="maybe">Maybe</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

* Handling `this`:
  - Use arrow function: `<form onSubmit={event => this.formSubmit(event)}>`
  - Binding in constructor: `this.formSubmit = this.formSubmit.bind(this);`

#### Asynchronous Validation
* communicate with web server in background (e.g. username taken; autocomplete)

##### Axios Promise-based HTTP Client
* Get: page 10, 11, 12

```JavaScript
axios.get(URLpath)
  .then((response) => {
  // response.status - HTTP response status (eg 200)
  // response.statusText - HTTP response status text (eg OK) // response.data - Response body object (JSON parsed)
})
  .catch((err) => {
// err.response.{status, data, headers) - Non-2xx status HTTP response // if !err.response - No reply, can look at err.request
});

// two functions passed into .then()
axios.get(URLpath)
  .then((response) => {},
        (err) => {}
);
```

* Post: page 13

```JavaScript
axios.post(URLpath, objectWithParameters)
  .then((response) => {
  // response.status - HTTP response status (eg 200)
  // response.statusText - HTTP response status text (eg OK) // response.data - Response body object (JSON parsed)
  })
  .catch((err) => {
  // err.response.{status, data, headers) - Non-2xx status HTTP response // if !err.response - No reply, can look at err.request
});
```

* Define **validator function** in schema (page 14).

```
var userSchema = new Schema({
  phone: {
    type: String,
    validate: {
      validator: function(v) {
          return /d{3}-d{3}-d{4}/.test(v);
      },
      message: '{VALUE} is not a valid phone number!'
    }
  }
);
```

___
#### State Management [[StateManagement.pdf](StateManagement.pdf)]
* Log-in -> log-out transition.
* Methods of notifying component:
  - Passing callback function: `<Component commInfo={this.callMeWithInfo.bind(this)} />`
  - Using listener/emitter pattern: `FLUX` or [Redux](https://redux.js.org/)
    * FLUX, Redux are common framework for implementing listener-emitter pattern
* What should happen when data model is changed:
  1. Do nothing.
  2. Periodic pull.
  3. Server push.
* Check for log-in: use **ternary logic** for conditional rendering:

```JavaScript
{
  this.userIsLoggedIn ?
  <Route path="/users/:id" component={UserDetail} />
  :
  <Redirect path="/users/:id" to="/login-register" />
}
```
