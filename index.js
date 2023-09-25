let books = [];
const renderEvent = "render";
const key = "BOOKS";

document.addEventListener("DOMContentLoaded", function () {
  const formContainer = document.getElementById("form-container");
  formContainer.addEventListener("submit", function (e) {
    addBook();
    message("Buku berhasil ditambahkan!");
    e.preventDefault();
  });
  if (storageExist()) {
    loadData();
  }

  const input = document.querySelectorAll("label ~ input");
  input.forEach((i) => {
    i.addEventListener("focus", function () {
      i.style.boxShadow = "-1px 1px 10px 1px #d5f3d5";
      i.style.border = "";
    });
    i.addEventListener("blur", function () {
      i.style.boxShadow = "";
    });
  });

  const searchBtn = document.getElementById("search-btn");
  searchBtn.addEventListener("click", function () {
    searchBookFunction();
  });
});

document.addEventListener(renderEvent, function () {
  const currentBooks = document.getElementById("current-books");
  const finishBooks = document.getElementById("finish-books");
  currentBooks.innerHTML = "";
  finishBooks.innerHTML = "";

  for (const book of books) {
    const element = elementBook(book);
    if (!book.isComplete) {
      currentBooks.append(element);
    } else {
      finishBooks.append(element);
    }
  }
});

function addBook() {
  const id = Date.now();
  const title = document.getElementById("title").value.toUpperCase();
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const checkBox = document.querySelector("#checkbox").checked;
  const isComplete = checkBox ? true : false;

  const bookObject = { id, title, author, year: Number(year), isComplete };
  books.push(bookObject);
  document.dispatchEvent(new Event(renderEvent));
  saveBook();
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("year").value = "";
  document.getElementById("checkbox").checked = false;
}

function elementBook(item) {
  const title = document.createElement("h2");
  title.innerText = item.title;
  const author = document.createElement("p");
  author.innerText = `Penulis: ${item.author}`;
  const year = document.createElement("p");
  year.innerText = `Tahun: ${item.year}`;

  const bookData = document.createElement("div");
  bookData.append(title, author, year);

  const itemContainer = document.createElement("div");
  itemContainer.id = item.id;
  itemContainer.classList.add("item-container");
  itemContainer.append(bookData);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener("click", function () {
    deleteBtnBook(item.id);
  });

  if (item.isComplete) {
    const undoBtn = document.createElement("button");
    undoBtn.classList.add("undo-btn");
    undoBtn.addEventListener("click", function () {
      filterBookComplited(item.id);
    });

    const divBtn = document.createElement("div");
    divBtn.classList.add("btn-container");
    divBtn.append(undoBtn, deleteBtn);

    itemContainer.append(divBtn);
  } else {
    const checkBtn = document.createElement("button");
    checkBtn.classList.add("check-btn");

    checkBtn.addEventListener("click", function () {
      filterBookComplited(item.id);
    });

    const divBtn = document.createElement("div");
    divBtn.classList.add("btn-container");
    divBtn.append(checkBtn, deleteBtn);

    itemContainer.append(divBtn);
  }
  return itemContainer;
}

function saveBook() {
  if (storageExist()) {
    const storeBook = JSON.stringify(books);
    localStorage.setItem(key, storeBook);
  }
}

function storageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser not support the web storage");
    return false;
  }
  return true;
}

function loadData() {
  const serializedData = localStorage.getItem(key);
  let bookData = JSON.parse(serializedData);
  if (bookData !== null) {
    for (const book of bookData) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(renderEvent));
}

function filterBookComplited(id) {
  const getBook = books.find((i) => i.id === id);
  if (getBook.isComplete === true) {
    getBook.isComplete = false;
  } else {
    getBook.isComplete = true;
  }
  document.dispatchEvent(new Event(renderEvent));
  saveBook();
}

function deleteBtnBook(id) {
  const getBook = books.filter((i) => i.id !== id);
  books = getBook;
  document.dispatchEvent(new Event(renderEvent));
  saveBook();
  message("Buku dihapus");
}

function message(msg) {
  const textMsg = document.createElement("h3");
  const boxMsg = document.getElementById("message");

  if (msg === "Buku dihapus") {
    textMsg.classList.add("del-text");
    boxMsg.classList.add("del-message");
  } else {
    textMsg.classList.add("text-message");
    boxMsg.classList.add("message");
  }

  textMsg.innerText = msg;
  boxMsg.append(textMsg);
  boxMsg.style.display = "block";

  setTimeout(() => {
    boxMsg.style.display = "none";
    textMsg.remove();
    boxMsg.classList = "";
  }, 2000);
}

function searchBookFunction() {
  const input = document.getElementById("search-book").value.toUpperCase();
  const titlesBook = document.querySelectorAll(".item-container > div > h2");

  for (let title of titlesBook) {
    if (title.innerText.includes(input)) {
      title.parentElement.parentElement.style.display = "flex";
    } else {
      title.parentElement.parentElement.style.display = "none";
    }
  }
}
