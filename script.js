$(document).ready(function () {
  console.log("hello world");

  //enabling tooltips with bootstrap
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );

  //variables
  let book, title, author, bookLink, bookImg, bookDescription;
  let book2, title2, author2, bookLink2, bookImg2, bookDescription2;

  let bookURL = "https://www.googleapis.com/books/v1/volumes?q=";
  /*API key that acts as an identifier 
  - not possible to make requests to the BOOKS API for public data without it
  */
  let apiKey = "AIzaSyDh3E43dXgVWUxwakvvR487Emy6APe73Ak";

  let input = $("#input-search");

  //error message if no book is found
  let errorMessage = document.querySelector(".error-message");
  let btnError = document.querySelector(".btn-error");

  //error message if no input is entered
  let errorInput = document.querySelector(".error-message-noinput");
  let btnInput = document.querySelector(".btn-input");

  //results of the search
  let booksResult = document.querySelector("#books-result");
  let searchData;

  let books = [];
  //library contains all the books that are added to "favourites"
  let library = [];

  //dispay the previously selected books using session storage to get the library
  window.onload = function getLibraryFromMemory() {
    if (sessionStorage.getItem("favBooks")) {
      library = JSON.parse(sessionStorage.getItem("favBooks"));
      //display each object saved in the array 'library' as an HTML card
      library.forEach((book) => {
        let favBook = document.createElement("div");
        favBook.classList.add("col-xs-11", "col-sm-6", "col-md-4", "col-lg-3");
        favBook.innerHTML = `<div class="card">
              <img src="${book.image}" class="card-img-top"  alt="image displaying the book ${book.title}" />
              <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text">
                  ${book.author}
                </p>
                <a href="${book.link}" class="btn btn-primary">Go somewhere</a>
              </div>
            </div>`;
        let favBooksContainer = document.querySelector("#favBooksContainer");
        if (favBooksContainer) {
          favBooksContainer.appendChild(favBook);
        }
      });
    }
  };

  //input search
  $(".sp-submit").click(function (e) {
    e.preventDefault();
    /*clear the ".books-result" div when the form is submitted,
      so the previos search results dissapear*/
    booksResult.innerHTML = "";
    //give the searchData variable the value of the input
    searchData = input.val();
    //handing empty input field
    if (searchData === "") {
      errorInput.style.display = "block";
      btnError.addEventListener("click", function () {
        errorInput.style.display = "none";
      });
    } else {
      getBookFromGoogle(searchData);
    }
  });

  $(window).keydown(function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      /*clear the ".books-result" div when the form is submitted,
      so the previos search results dissapear*/
      booksResult.innerHTML = "";
      //give the searchData variable the value of the input
      searchData = input.val();
      //handing empty input field
      if (searchData === "") {
        errorInput.style.display = "block";
        btnInput.addEventListener("click", function () {
          errorInput.style.display = "none";
        });
      } else {
        getBookFromGoogle(searchData);
      }
    }
  });

  /*make a fetch request to BOOKS API 
  - returns a promise which is fulfilled with a response object*/
  const getBookFromGoogle = async (param) => {
    try {
      const response = await fetch(`${bookURL}${param}&key=${apiKey}`);
      // it is necessary to extract the body of the response, with '.json()'
      const data = await response.json();
      //'books' will contain an array with all the results received from the fetch request in the shape of objects
      books = data.items;
      console.log(books);

      //display the results of the search
      for (let i = 0; i < books.length; i += 2) {
        book = books[i].volumeInfo;
        console.log(book);
        title = book.title;
        author = book.authors[0];
        bookLink = book.previewLink;
        bookImg = book.imageLinks.thumbnail;
        bookDescription = book.description;

        let bookFromGoogle = document.createElement("div");
        bookFromGoogle.classList.add("col-10", "col-md-10", "col-lg-6");
        bookFromGoogle.innerHTML = formatResultsHTML(
          title,
          author,
          bookLink,
          bookImg,
          bookDescription
        );
        console.log(bookFromGoogle);
        if (booksResult) {
          booksResult.appendChild(bookFromGoogle);
        }
      }
    } catch (e) {
      console.log("ERROR", e);
      errorMessage.style.display = "block";
      btnError.addEventListener("click", function () {
        errorMessage.style.display = "none";
      });
    }
  };

  //format the htmlCard
  function formatResultsHTML(title, author, bookLink, bookImg, description) {
    let htmlCard = `<div class="card">
      <div class="row g-0"> 
        <div class="col-sm-4">
          <img src="${bookImg}" class="" alt="image displaying the cover of the book ${title}">
        </div>
        <div class="col-sm-8">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">Author: ${author}</p>
            <div>
              <button type="button" class="btn px-0" data-bs-toggle="modal" data-bs-target="#descriptionModal" data-bs-whatever="${description}">
              View description</button>
              <a target="_blank" href="${bookLink}" class="btn px-0">View book</a>
            </div>
            <button type="button" class="add-to-library" onClick ="this.style.color='black'" data-link="${bookLink}" data-title="${title}" data-img="${bookImg}" data-author="${author}">&hearts; 
            </button>
          </div>
        </div>
      </div>
    </div>`;
    return htmlCard;
  }

  /*select a book and add it to favourites, by extracting
  its details using data-* and getAtrribute;
  - added the event listener on the whole results section,
  as it is easier to select the details of the book that was
  clicked with event.target
  */
  booksResult.addEventListener("click", function (event) {
    let positionClick = event.target;
    if (positionClick.classList.contains("add-to-library")) {
      let selectedBookTitle = positionClick.getAttribute("data-title");
      let selectedBookAuthor = positionClick.getAttribute("data-author");
      let selectedBookImg = positionClick.getAttribute("data-img");
      let selectedBookLink = positionClick.getAttribute("data-link");

      let newFavourite = new Favourite(
        selectedBookTitle,
        selectedBookAuthor,
        selectedBookImg,
        selectedBookLink
      );
      /*saving the library in session storage, to be able to see the cards in the library page, 
      even if the search page changes*/
      library.push(newFavourite);
      addLibraryToMemory();
      addCardToLibraryHTML(selectedBookTitle);
    }
  });

  //turning the element into an object, to later be saved into a variable
  class Favourite {
    constructor(title, author, image, link) {
      this.title = title;
      this.author = author;
      this.image = image;
      this.link = link;
    }
  }

  //adding the updated library to session storage
  function addLibraryToMemory() {
    sessionStorage.setItem("favBooks", JSON.stringify(library));
  }

  //adding the card to the library HTML
  function addCardToLibraryHTML(selectedBookTitle) {
    let favBook = library.find((o) => o.title === selectedBookTitle);
    let newBookHTML = document.createElement("div");
    newBookHTML.classList.add("col-xs-11", "col-sm-6", "col-md-4", "col-lg-3");
    newBookHTML.innerHTML = `<div class="card">
            <img src="${favBook.image}" class="card-img-top" alt="image displaying the book ${book.title}" />
            <div class="card-body">
              <h5 class="card-title">${favBook.title}</h5>
              <p class="card-text">
                ${favBook.author}
              </p>
              <a href="${favBook.link}" class="btn btn-primary">Go somewhere</a>
            </div>
      </div>`;
    let favBooksContainer = document.querySelector("#favBooksContainer");
    if (favBooksContainer) {
      favBooksContainer.appendChild(newBookHTML);
    }
  }

  //view book description
  let buttonModal = document.getElementById("descriptionModal");
  let modalBody = document.querySelector(".modal-body");

  function viewDescription(description) {
    if (buttonModal) {
      buttonModal.addEventListener("show.bs.modal", (event) => {
        // find the button that triggered the modal
        const buttonTriggered = event.relatedTarget;
        const descriptionAttribute =
          buttonTriggered.getAttribute("data-bs-whatever");
        modalBody.textContent = descriptionAttribute;
        if (modalBody.textContent === "undefined") {
          modalBody.textContent =
            "Sorry! No description is available for this book. But have you tried a blind date with a book?";
        }
      });
    }
  }

  viewDescription(bookDescription);
});

/*

*/
