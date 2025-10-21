# CS 260 Notes

[My startup - Simon](https://simon.cs260.click)

link element
Loads external resources (most often CSS) into the document head.
Example: <link rel="stylesheet" href="styles.css">

div tag
A generic block-level container used to group content for styling/layout. It has no semantic meaning by itself.

#title vs .grid
#title selects the single element with id="title".
.grid selects all elements with class="grid".
Specificity: #id > .class.

padding vs margin
Padding = space inside the border (between content and border).
Margin = space outside the border (between the element and neighbors).

Images with flex (general rules)

display: flex arranges children in a row by default (flex-direction: row).

flex-wrap: wrap lets them wrap to new lines.

justify-content controls horizontal distribution; align-items controls cross-axis alignment; gap sets spacing between items.

Child sizing often via flex: 1 1 200px; etc.

“padding: …” does what?

padding: 10px; → all sides 10px

padding: 10px 20px; → top/bottom 10px, left/right 20px

padding: 5px 10px 15px; → top 5, left/right 10, bottom 15

padding: 1px 2px 3px 4px; → top/right/bottom/left

Arrow function declaration
Creates a function with concise syntax and lexical this.
Example: const add = (a, b) => a + b;

Array.map output
Returns a new array of the return values, same length, doesn’t mutate original.
Example: [1,2,3].map(n => n*2) // [2,4,6]

getElementById + addEventListener
Finds an element by id and attaches an event handler.

document.getElementById('btn').addEventListener('click', () => {
  console.log('clicked');
});


“# selector” line does what?
In CSS: #title {…} styles the element with id="title".
In JS: document.querySelector('#title') selects that element.

DOM truths (mark all that apply)

The DOM is a tree representation of the document.

You can query and modify nodes at runtime.

Events bubble/capture through the tree.
(Those are all true.)

span default display
inline.

Make all divs red with CSS

div { background-color: red; }


Image with a hyperlink

<a href="https://example.com">
  <img src="pic.jpg" alt="Description">
</a>


CSS box model order (inside → outside)
content → padding → border → margin.

Make only the word “trouble” green (not “double”)
You need a wrapper or selector that isolates that text:

<p>double <span class="trouble">trouble</span></p>

.trouble { color: green; }


For-loop + console.log output
General rule: it logs each iteration value in order.
Example:

for (let i=0; i<3; i++) console.log(i);
// 0, 1, 2 (each on its own line)


Select element with id “byu” and turn text green

document.getElementById('byu').style.color = 'green';


Opening tags:

paragraph: <p>

ordered list: <ol>

unordered list: <ul>

second-level heading: <h2>

first-level heading: <h1>

third-level heading: <h3>

Declare HTML5 doctype
<!DOCTYPE html>

Valid JS syntax (quick patterns)

if (x) { ... } else { ... }

for (let i=0; i<n; i++) { ... }

while (cond) { ... }

switch (v) {
  case 1: ...; break;
  default: ...;
}


Create a JS object

const obj = { name: 'A', count: 3 };


Add new properties to objects?
Yes.

obj.newProp = 42;


Include JavaScript on an HTML page
Inline:

<script>
  console.log('hi');
</script>


External:

<script src="app.js"></script>


Change “animal” to “crow” but leave “fish” untouched
(Select just the “animal” node—usually by id or class.)

<p id="animal">animal</p><p>fish</p>
<script>
  document.getElementById('animal').textContent = 'crow';
</script>


JSON description
Text format for structured data: key/value pairs, arrays, numbers, booleans, strings, null. Keys and string values are in double quotes. No functions or comments. Example:
{"name":"Alex","age":20,"pets":["dog"]}

Console command cheatsheet

chmod change file permissions

pwd print working directory

cd change directory

ls list directory contents

vim terminal editor

nano terminal editor (simpler)

mkdir make directory

mv move/rename files

rm remove files

man show manual pages

ssh remote shell login

ps list running processes

wget download by URL

sudo run as superuser

Command that creates a remote shell session
ssh user@host

ls -la truth
Shows a long listing of all files (including dotfiles/hidden), with perms, owner, size, timestamps.

Domain parts for banana.fruit.bozo.click

TLD: click

Root (registrable) domain: bozo.click

Subdomain(s): fruit.bozo.click is one level; banana.fruit.bozo.click nests another. (So banana.fruit is the subdomain chain of bozo.click.)

Is a web certificate necessary for HTTPS?
Yes—browsers require a valid TLS certificate for trusted HTTPS connections.

Can a DNS A record point to an IP or another A record?
An A record maps only to an IPv4 address (not to another A record). So “IP or another A” → False. (Use CNAME to point to another name.)

Ports 443, 80, 22 reserved for what?
443 → HTTPS, 80 → HTTP, 22 → SSH.

Promises output ordering (general rules)

Code in the Promise executor runs immediately (synchronously).

.then/.catch callbacks run as microtasks after the current call stack but before normal timers.

setTimeout(..., 0) runs later as a macrotask.
Typical order for:

console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');


Output: A, D, B, C (each on its own line).
## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

My IP address is: 54.81.96.130
Launching my AMI I initially put it on a private subnet. Even though it had a public IP address and the security group was right, I wasn't able to connect to it.

## Caddy

No problems worked just like it said in the [instruction](https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md).

## HTML

This was easy. I was careful to use the correct structural elements such as header, footer, main, nav, and form. The links between the three views work great using the `a` element.

The part I didn't like was the duplication of the header and footer code. This is messy, but it will get cleaned up when I get to React.

## CSS

This took a couple hours to get it how I wanted. It was important to make it responsive and Bootstrap helped with that. It looks great on all kinds of screen sizes.

Bootstrap seems a bit like magic. It styles things nicely, but is very opinionated. You either do, or you do not. There doesn't seem to be much in between.

I did like the navbar it made it super easy to build a responsive header.

```html
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand">
            <img src="logo.svg" width="30" height="30" class="d-inline-block align-top" alt="" />
            Calmer
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" href="play.html">Play</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="about.html">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="index.html">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
```

I also used SVG to make the icon and logo for the app. This turned out to be a piece of cake.

```html
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0066aa" rx="10" ry="10" />
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="72" font-family="Arial" fill="white">C</text>
</svg>
```

## React Part 1: Routing

Setting up Vite and React was pretty simple. I had a bit of trouble because of conflicting CSS. This isn't as straight forward as you would find with Svelte or Vue, but I made it work in the end. If there was a ton of CSS it would be a real problem. It sure was nice to have the code structured in a more usable way.

## My notes
Port 442 is https, port 80 is http. For img its <img src='link' alt='description' width='sizing'/> link is href. Tr is table row, th is table head, td is table cell. text	Single line textual value
password	Obscured password
email	Email address
tel	Telephone number
url	URL address
number	Numerical value
checkbox	Inclusive selection
radio	Exclusive selection
range	Range limited number
date	Year, month, day
datetime-local	Date and time
month	Year, month
week	Week of year
color	Color
file	Local file
submit	button to trigger form submission
form	Input container and submission	<form action="form.html" method="post">
fieldset	Labeled input grouping	<fieldset> ... </fieldset>
input	Multiple types of user input	<input type="" />
select	Selection dropdown	<select><option>1</option></select>
optgroup	Grouped selection dropdown	<optgroup><option>1</option></optgroup>
option	Selection option	<option selected>option2</option>
textarea	Multiline text input	<textarea></textarea>
label	Individual input label	<label for="range">Range: </label>
output	Output of input	<output for="range">0</output>
meter	Display value with a known range	<meter min="0" max="100" value="50"></meter>

