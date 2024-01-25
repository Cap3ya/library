/// PROTOTYPES \\\

class Book {
  constructor(title, author, pages, read) {
      this.title = title,
      this.author = author,
      this.pages = pages,
      this.read = read;        
  }
}

/// VARIABLES \\\

// COUNT - Specific ID that increments when a new book is created
const localCount = {
  get: () => window.localStorage.getItem('count'),
  set: () => window.localStorage.setItem('count', count)
}
let count = (localCount.get() === null) ? 0 : Number(localCount.get())
const counter = () => {
  count++
  localCount.set()
} 

// LIBRARY - Get myLibrary JSON from localStorage and parse it. 
const localLibrary = {
  set: () => window.localStorage.setItem('library', JSON.stringify(library)),
  get: () => JSON.parse(window.localStorage.getItem('library'))
}
const library = Object.assign({}, localLibrary.get())

/// FUNCTIONS \\\

//MAKE NEW BOOK FROM FORM TO LOCALSTORAGE
function makeNewBook (form) {
  // Construct New Book 
  const newBook = new Book(form.title.value, form.author.value, form.pages.value, form.read.value)
  // Add New Book to Library
   library[`key${count}`] = newBook
  // export library
   localLibrary.set()
  counter()
}

// MAKE NEW NODES FROM LOCALSTORAGE TO HTML
function newNode(tag, id, thisClass, innertext, attribute, event, thisFunction) {
  const newNode = document.createElement(tag);
  if (id !== false) { newNode.id = id };
  if (thisClass !== false) { newNode.classList = thisClass };
  if (innertext !== false) { newNode.innerText = innertext };
  if (attribute !== false) { newNode.setAttribute(event, thisFunction) };
  return newNode;
}

// ONCLICK REMOVE BOOK
function bookRemove(key) {
  const myNode = document.getElementById(key);
  while (myNode.firstChild) {
      myNode.removeChild(myNode.lastChild);
  }
  myNode.remove()
  // REMOVE FROM LOCALSTORAGE
  delete library[key]
  localLibrary.set()
}

// ONCLICK EDIT BOOK
function bookEdit(key, property) {
  const edit = prompt('Edit:')
  //EDIT HTML ELEMENT
  if (edit) {
  const parent = document.querySelector(`#${key}`)
  const child = parent.querySelector(`#${property}`)
  child.textContent = edit
  //EDIT LOCALSTORAGE.LIBRARY.KEY.PROPERTY
  library[key][property] = edit
  localLibrary.set()
  //NEED TO REFRESH to update progress
  location.reload()
  }
}

/// MAIN \\\

// CREAT A CARD FOR EACH BOOK FROM LOCAL STORAGE
for ( const [key, value] of Object.entries( library ) ) {
  // IF KEY IS NOT A METHOD (SET or GET)
  if ( key.includes('key') ) {
    // Creat new nodes for book
    const book = newNode('div', key, 'book', false, false)
    const title = newNode('h2', 'title', 'edit', value.title, true, 'onclick', `bookEdit('${key}', 'title')`)
    const author = newNode('em', 'author', 'edit', value.author, true, 'onclick', `bookEdit('${key}', 'author')`)
    const pages = newNode('p', 'pages','edit',value.pages, true, 'onclick', `bookEdit('${key}', 'pages')`)
    const read = newNode('p', 'read','edit',value.read,  true, 'onclick', `bookEdit('${key}', 'read')`)
    const progress = newNode('p', false, 'progress', `${ Math.round(value.read/value.pages*100) }%`, false)
    const remove = newNode('button', false, 'remove', 'Remove', true, 'onclick', `bookRemove('${key}')`)
    // NEST BOOKS BETWEEN LIBRARY AND FROM
    const library = document.querySelector('.library')
    const div = document.querySelector('form')
    // Append new nodes 
    library.insertBefore(book, div)
    for (child of [title, author, pages, read, progress, remove]) {
      book.appendChild(child)
    }
  }
}