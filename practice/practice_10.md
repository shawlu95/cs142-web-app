### Practice 10 Short

#### Question 1
What does "stateless server" mean?
It means that a service's provider's all servers can accept request from any random users. There is no need that a request from a specific user has to go to a specific server. Load balancing for stateless servers is very easy since it can use any algorithm.

#### Question 2
What does "serverless computing " mean?
It means that a web developer can only provide pieces of code as well as URLs associated with each code, and the serverless cloud infrastructure will do the rest. Serverless computing such as Amazon Lambda, for instance, will allocate machines to run your code, arrange name mappings so that HTTP requests find their way to your code, scale machine allocation up and down automatically, and include a scalable storage system. They provide only services, not servers.

#### Question 3
What does "scaling-up" and "scaling-out" mean? Give one advantage of each.

Scale-up means that there is only one instance of storage, and when there more data this instance keeps expanding. The advantage is that there is only one instance so it is easy to manage.

Scale-out means that when there are more data, the instances multiplies. There are many advantages of scale-out: 1. scale-up will quickly meet limit while scale-out will not; 2. scale-out means there can be duplicates of data (data sharding) and therefore there is more tolerance in server failures

**scaling-up**:
* Single machine is easy to install and configure.

**scaling-out**:
* fault tolerant
* can route user requests to geographically closes server.
* cheaper to buy lots of compute nodes with low computation power than one single super computer

#### Question 4
Advantage of GraphQL over REST API
* Can read only desired properties.
* Can bundle multiple requests in a single GraphQL query.
  - Good for high latency(延迟) network

#### Question 5
What is *fragment* in a URL?
`#` anchor

#### Question 6
What are invalid character in URL? [[Link](https://perishablepress.com/stop-using-unsafe-characters-in-urls/)]
`Any character in a URL other than A-Z, a-z, 0-9, or any of -_.~ must be
represented as %xx, where xx is the hexadecimal value of the character:`

#### Question 7
What type of URL causes a page reload?
A URL of a different hierachical order?????


#### Question 8 Reading (Take notes!)
SQL injection attack [[Link](https://www.tinfoilsecurity.com/blog/what-is-sql-injection)]
SQL injection happens when an attacker injects some malicious information into DB to retrieve sensitive information in the DB. For instance, if a bank DB gives the users access to their account by logging in with their user name and password. The SQL DB returns the id of the user through this:
`String sql = "SELECT id from users" +
  WHERE username = 'Tom'
    AND password = 3212
    LIMIT 1'`
The attacker can type ' OR id=1 --
so it will return the userID 1.

Or type
`"Sam'; UPDATE grades
                SET grade = 4.0"`
* Give an example:
* Defense: Use parameterized statement, that is, SQL statement with placeholders such as "?"


Cross site scripting attack [[Link](https://www.tinfoilsecurity.com/blog/what-is-cross-site-scripting-xss)]

XSS allows malicious users to inject client-side code to the webpage to be run by other suspecting users.

Stored XSS: e.g. write malicious script as a comment and stored it on the webpage.
Reflected XSS: e.g. search, return a search for xxx script tag, and mail it to other users (check this out!)

* Give an example:
* Defense: Avoid user input. detect dangerous input

Cross site forgery attack [[Link](https://www.tinfoilsecurity.com/blog/what-is-cross-site-request-forgery-csrf)]

First visit a legal website then tricked into visiting the attacker's website, which includes javascript that submits a form to the legal website you just visited. When the form gets submitted, browser includes your session cookies, and then the attacker can impersonate you and use your login state to do bad things.
* Give an example:
* Defense: 1. Server can mark forms that came from its pages. Every form must contain an additional authentication token as a hidden field. It can check the form posted for the token and rejects forms that don't have it.
2. javascript solution: don't accept POST submission directly from forms. HTTP request should not have side effects. Have JS include special HTTP request header property with secret.
(????????????????)

#### Question 9 MAC
Summarize how MAC works by reading [[tutorial](https://www.wisegeek.com/what-is-a-message-authentication-code.htm)]:

MAC takes in a text and a secret key and produces a unique MAC signature for the text. When the server sends data to the browser, it includes MAC. And when the data gets sent back, the server uses the secret key to check MAC. Since only with the secret key can MAC be generated, any changes to the MAC means data tampering. MAC can guarantee the authentication and integrity of the data sent to the server.


**Further reading** [[Wikipedia](https://en.wikipedia.org/wiki/Message_authentication_code)]

Informally, a message authentication code consists of three algorithms:
* A key generation algorithm selects a key from the key space uniformly at random.
* A signing algorithm efficiently returns a tag given the key and the message.
* A verifying algorithm efficiently verifies the authenticity of the message given the key and the tag. That is, return accepted when the message and tag are not tampered with or forged, and otherwise return rejected.

Formally, a message authentication code (MAC) is a triple of efficient[2] algorithms (G, S, V) satisfying:
* G (key-generator) gives the key k on input 1n, where n is the security parameter.
* S (signing) outputs a tag t on the key k and the input string x.
* V (verifying) outputs accepted or rejected on inputs: the key k, the string x and the tag t. S and V must satisfy the following:
