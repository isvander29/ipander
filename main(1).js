const modal = document.getElementById("mymodal");
const button = document.getElementById("btn");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const inputBookForm = document.getElementById('inputBook');
  const searchBookForm = document.getElementById('searchBook');
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');
 
  inputBookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
 
  searchBookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBook();
  });
 
  function addBook() {
    const bookId = generateUniqueId();
 
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked
 
    const book = createBook(bookId, title, author, year, isComplete);
 
    if (isComplete) {
      completeBookshelfList.appendChild(book);
    } else {
      incompleteBookshelfList.appendChild(book);
    }
 
    updateLocalStorage();
    resetInputForm();
  }
 
  function createBook(id, title, author, year, isComplete) {
    const book = document.createElement('article');
    // ketika membuat item baru haus buat class complete, karena yang dijaddikan aksi acuan adalah class complete
    isComplete ? book.className = 'book_item complete': book.className = 'book_item' 
    book.dataset.id = id;
 
    const bookInfo = document.createElement('div');
    bookInfo.innerHTML = `
      <h3>${title}</h3>
      <p>Penulis: ${author}</p>
      <p>Tahun: ${year}</p>
    `;
 
    const bookActions = document.createElement('div');
    bookActions.className = 'action';
 
    const removeButton = createButton('Hapus buku', 'red', function () {
      removeBook(book);
    });
 
    bookActions.appendChild(removeButton);
 
    const statusButton = createButton(isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca', 'green', function () {
      toggleBookStatus(book);
    });
 
    bookActions.appendChild(statusButton);
    book.appendChild(bookInfo);
    book.appendChild(bookActions);
 
    return book;
  }
 
  function createButton(text, color, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(color);
    button.addEventListener('click', clickHandler);
    return button;
  }
 
  function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
 
  function toggleBookStatus(book) {
    const isComplete = book.classList.contains('complete');
    if (isComplete) {
      undoBook(book);
    } else {
      completeBook(book);
    }
  }
 
  function completeBook(book) {
    const completedBookshelfList = document.getElementById('completeBookshelfList');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
 
    incompleteBookshelfList.removeChild(book);
 
    completedBookshelfList.appendChild(book);
 
    book.classList.add('complete');
 
    updateStatusButton(book,'Belum selesai dibaca');
 
    updateLocalStorage();
  }
 
  function undoBook(book) {
    const completedBookshelfList = document.getElementById('completeBookshelfList');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
 
    completedBookshelfList.removeChild(book);
 
    incompleteBookshelfList.appendChild(book);
 
    book.classList.remove('complete');
 
    updateStatusButton(book,'Selesai Dibaca');
 
    updateLocalStorage();
  }
 
  function updateStatusButton(book,text) {
    const statusButton = book.querySelector('button.green');
    statusButton.textContent = text
  }
 
  function removeBook(book) {
    const parentList = book.parentElement;
    parentList.removeChild(book);
    updateLocalStorage();
  }
 
  function searchBook() {
    const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    const allBooks = document.querySelectorAll('.book_item');
 
    allBooks.forEach(function (book) {
      const title = book.querySelector('h3').textContent.toLowerCase();
      if (title.includes(searchTitle)) {
        book.style.display = 'block';
      } else {
        book.style.display = 'none';
      }
    });
  }
 
  function updateLocalStorage() {
    const incompleteBooks = Array.from(incompleteBookshelfList.children).map(book => getBookInfo(book));
    const completeBooks = Array.from(completeBookshelfList.children).map(book => getBookInfo(book));
 
    localStorage.setItem('incompleteBooks', JSON.stringify(incompleteBooks));
    localStorage.setItem('completeBooks', JSON.stringify(completeBooks));
  }

  function loadBooksFromLocalStorage(){
    const incompleteBooks = JSON.parse(localStorage.getItem('incompleteBooks')) || [];
    const completeBooks = JSON.parse(localStorage.getItem('completeBooks')) || [];

    incompleteBooks.forEach(book => {
      const newBook = createBook(book.id, book.title, book.author, book.year, book.isComplete);
      incompleteBookshelfList.appendChild(newBook);
    });
  
    completeBooks.forEach(book => {
      const newBook = createBook(book.id, book.title, book.author, book.year, book.isComplete);
      completeBookshelfList.appendChild(newBook);
    });
  }
  function getBookInfo(book) {
    const title = book.querySelector('h3').textContent;
    const author = book.querySelector('p:nth-child(2)').textContent.slice(9);
    const year = parseInt (book.querySelector('p:nth-child(3)').textContent.slice(7));
    const isComplete = book.classList.contains('complete');
 
    return {
      id: book.dataset.id,
      title,
      author,
      year,
      isComplete,
    };
  }
 
  function resetInputForm() {
    inputBookForm.reset();
  }
 
  loadBooksFromLocalStorage();
});