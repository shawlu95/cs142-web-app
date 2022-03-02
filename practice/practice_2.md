### Practice 2: SPA & URL
*May 19*

### Single-Page Application
Read the following articles. Take notes as you read. Then answer the True/False question below.
* Single-page application vs. multiple-page application [[Link](https://medium.com/@NeotericEU/single-page-application-vs-multiple-page-application-2591588efe58)]
* What is a Single Page Application? [[Link](https://flaviocopes.com/single-page-application/)]
#### Notes:
* SPA is...
* Examples of SPA: Gmail...
* Examples of MPA:

#### True/False
* SPA only contains a single page (e.g. you can't navigate from user's profile page to his photos page). **Ans:** F
* SPA only contains a single page load. **Ans:** T
* SPA loads HTML, CSS, JS files only once in its lifespan. **Ans:**
  - If not, give a counter example: Most files only once; but files containing updates of the data will be reloaded.
* SPA loads user data only once during its lifespan. **Ans:**
  - If not, give a counter example: keep updating
* AJAX (Asynchronous JavaScript and XML) is a method of exchanging data and updating in the application without refreshing the page. **Ans:** T
* In SPA, back and forth buttons in browser are useless because there's only one single page. **Ans:** No

#### Short Answers
List 3 advantages of SPA over MPA:
1. SPA... Fast
2. SPA... easy to develop
3. SPA... easy to debug using Chrome

List 3 disadvantages of SPA:
1. SPA... less secure (prone to XSS attack)
2. SPA... slow to download for the first time
3. SPA... have to have JavaScript

#### Case Study
Now consider the photo-sharing [app](https://github.com/tingyu95/cs142_web_app/blob/master/project5react/photo-share.html).

**Question 1**: is this a single-page application (Yes/No)? **Ans:**
Y
**Question 2**: what are the two `.js` files imported?
  * First: `modelData/photoApp..js`
  * Second: `compiled/photoShare.bundle.js`
  * Which `.js` file simulates the functionalities of a database? **Ans:** modelData
  * which `.js` file packages all ReactJS components together? **Ans:** bundle

**Question 3**: what kinds of data does the application load during its lifespan? Give two examples. **Ans:** uploaded photos; comments

**Question 4**: does it load all data at once (Yes/No)? **Ans:** no

___
### URL Practice
**Question 1** As you are reading this file in browser, the url is: `https://github.com/tingyu95/cs142_web_app/blob/master/practice/practice_2.md`
  - What is the port number?  **Ans:**
  - What is the hierarchical portion?  **Ans:**
  - What is the file name?  **Ans:**
  - What are the parameters?  **Ans:**
  - If you click <a href='practice_1.md'>`<a href='practice_1.md'></a>`</a>, what is the URL? (Click to confirm)

     **Ans:**
     `https://github.com/tingyu95/cs142_web_app/blob/master/practice/practice_1.md`

  - If you click <a href='./practice_1.md'>`<a href='./practice_1.md'></a>`</a>, what is the URL? (Click to confirm)

    **Ans:**`https://github.com/tingyu95/cs142_web_app/blob/master/practice/practice_1.md`

  - If you click <a href='/practice_1.md'>`<a href='/practice_1.md'></a>`</a>, what is the URL? (Click to confirm)

    **Ans:** `https://github.com/practice_1.md`

  - If you click <a href='../readme.md'>`<a href='../readme.md'></a>`</a>, what is the URL? (Click to confirm)

    **Ans:** `https://github.com/tingyu95/cs142_web_app/blob/master/readme.md`

  - Click [here](https://github.com/tingyu95/cs142_web_app/blob/master/screenshot/2019-05-18%20at%2011.16.18%20PM.png) to look at an image. What is the image name? What is the URL? How are space <kbd>Space</kbd>, dot <kbd>.</kbd> and dash <kbd>-</kbd> represented in URL?

    **Ans:**


**Question 2**: Open NodeJS server for project 4. Open [project 4](http://localhost:3000/getting-started.html) and scroll down to the bottom of the page. Find the button `Back to Top`.
* What is the port number? **Ans:** 3000
* How is the button defined? Copy its HTML below:

```HTML
<button>
  <a href="#top">Back to Top</a>
</button>
```

* Click the button. What is the URL in browser? **Ans:** `http://localhost:3000/getting-started.html#top`
* What part is added to the URL? **Ans:** fragment
* What does the additional part mean? **Ans:** an anchor at the top (helps scroll back to top)
* Find the DOM node that the button points to. Copy its HTML below:

```HTML
<h1 id="top">CS142 Project#4 React.js Example</h1>
```
