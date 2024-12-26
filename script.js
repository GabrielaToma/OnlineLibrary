document.addEventListener("DOMContentLoaded", function () {
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

  let input = document.querySelector("#input-search");
  let buttonSubmit = document.querySelector(".sp-submit");

  //error message if no book is found
  let errorMessage = document.querySelector(".error-message");
  let btnError = document.querySelector(".btn-error");

  //error message if no input is entered
  let errorInput = document.querySelector(".error-message-noinput");
  let btnInput = document.querySelector(".btn-input");

  //results of the search
  let booksResult = document.querySelector("#books-result");
  let searchData;
  //books contains all the data items from the fetch request
  let books = [];
  //library contains all the books that are added to "favourites"
  let library = [];
  //paragraph that shows up when no book is in the 'favourites' library
  let p = document.querySelector(".noFavouritesYet");

  //get the favourite books that were saved in sessionStorage
  window.onload = function getLibraryFromMemory() {
    //get the selected books that were added to favourites
    if (sessionStorage.getItem("favBooks")) {
      library = JSON.parse(sessionStorage.getItem("favBooks"));
      //display each object saved in the array 'library' as an HTML card
      if (library.length != 0) {
        //if there is a book in the 'favourites' section, remove the paragraph
        p.style.display = "none";
        library.forEach((book) => {
          let favBook = document.createElement("div");
          favBook.classList.add(
            "col-xs-11",
            "col-sm-6",
            "col-md-4",
            "col-lg-3"
          );
          favBook.setAttribute("name", book.title);
          favBook.innerHTML = `<div class="card">
                <a href="${book.link}" target="_blank"><img src="${
            book.image
          }" class="card-img-top"  alt="image displaying the book ${
            book.title
          }" data-bs-toggle="tooltip" data-bs-title="Default tooltip" data-bs-custom-class="custom-tooltip"/></a>
                <div class="card-body">
                  <h5 class="card-title">${book.title}</h5>
                  <p class="card-text">
                    ${book.author}
                  </p>
                  <button data-bs-toggle="modal" class="add-review" data-title="${
                    book.title
                  }" data-bs-target="#reviewModal">${doesReviewExist(
            book.title
          )}</button>
                  <button class="remove-element">Remove from favourites</button>
                </div>
              </div>`;
          let favBooksContainer = document.querySelector("#favBooksContainer");
          if (favBooksContainer) {
            favBooksContainer.appendChild(favBook);
          }
        });
      }
    }
  };

  /*check to see if the book has a review saved in sessionStorage onload: 
  - yes(name of the button will be 'See review');
  - no(name of the button will be 'Old friend? Add a review')*/
  function doesReviewExist(x) {
    if (sessionStorage.getItem("reviews")) {
      reviews = JSON.parse(sessionStorage.getItem("reviews"));
    }
    let reviewFound = reviews.find((o) => o.bookName === x);
    if (reviewFound === undefined) {
      return "Old friend? Add a review";
    } else {
      return "See review";
    }
  }

  //input search
  buttonSubmit.addEventListener("click", function (e) {
    e.preventDefault();
    /*clear the ".books-result" div when the form is submitted,
      so the previos search results dissapear*/
    booksResult.innerHTML = "";
    //give the searchData variable the value of the input
    searchData = input.value;
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

  window.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      /*clear the ".books-result" div when the form is submitted,
      so the previos search results dissapear*/
      booksResult.innerHTML = "";
      //give the searchData variable the value of the input
      searchData = input.value;
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
  async function getBookFromGoogle(param) {
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
        title = book.title;
        author = book.authors[0];
        bookLink = book.previewLink;
        bookImg = book.imageLinks?.thumbnail;
        bookDescription = book.description;

        book2 = books[i + 1].volumeInfo;
        title2 = book2.title;
        author2 = book2.authors[0];
        bookLink2 = book2.previewLink;
        bookImg2 = book2.imageLinks?.thumbnail;
        bookDescription2 = book2.description;

        booksResult.innerHTML +=
          '<div class="row gy-5 mt-3 mb-3 d-flex justify-content-around">' +
          formatResultsHTML(title, author, bookLink, bookImg, bookDescription) +
          formatResultsHTML(
            title2,
            author2,
            bookLink2,
            bookImg2,
            bookDescription2
          ) +
          "</div>";
      }
    } catch (e) {
      console.log("ERROR", e);
      errorMessage.style.display = "block";
      btnError.addEventListener("click", function () {
        errorMessage.style.display = "none";
      });
    }
  }

  //format the htmlCard
  function formatResultsHTML(title, author, bookLink, bookImg, description) {
    let htmlCard = `<div class="col-8 col-sm-10 col-lg-5" >
    <div class="card">
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
            <button type="button" class="add-to-library" style="color: rgb(215, 201, 201)" data-link="${bookLink}" data-title="${title}" data-img="${bookImg}" data-author="${author}">&hearts; 
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
    return htmlCard;
  }

  //view book description in modal
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

  /*select a book and add it to favourites, by extracting
  its details using data-* and getAtrribute;
  - added the event listener on the whole results section,
  as it is easier to select the details of the book that was
  clicked with event.target
  */
  booksResult.addEventListener("click", function (event) {
    let positionClick = event.target;
    if (positionClick.classList.contains("add-to-library")) {
      if (positionClick.style.color === "rgb(215, 201, 201)") {
        positionClick.style.color = "rgb(58, 9, 58)";
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
        //delete the paragraph in the 'favBooksContainer'
        p.style.display = "none";
      } else {
        positionClick.style.color = "rgb(215, 201, 201)";
        //delete the book from the library array
        let selectedBookTitleDeleted = positionClick.getAttribute("data-title");
        let indexOfBookToBeRemoved = library.findIndex(
          (e) => e.title === selectedBookTitleDeleted
        );
        library.splice(indexOfBookToBeRemoved, 1);
        //update session storage
        addLibraryToMemory();
        //delete the book from the library HTML
        let HTMLcollection = favBooksContainer.children;
        let childHTML = HTMLcollection.namedItem(selectedBookTitleDeleted);
        childHTML.remove();
        if (library.length === 0) {
          p.style.display = "block";
        }
      }
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
    newBookHTML.setAttribute("name", favBook.title);
    console.log(newBookHTML);
    newBookHTML.innerHTML = `<div class="card">
            <a href="${favBook.link}" target="_blank"><img src="${favBook.image}" class="card-img-top"  alt="image displaying the book ${favBook.title}" data-bs-toggle="tooltip" data-bs-title="Default tooltip" data-bs-custom-class="custom-tooltip"/></a>
            <div class="card-body">
              <h5 class="card-title">${favBook.title}</h5>
              <p class="card-text">
                ${favBook.author}
              </p>
              <button class="add-review" data-title="${favBook.title}" data-bs-toggle="modal" data-bs-target="#reviewModal">Old friend? Add a review</button>
              <button class="remove-element">Remove from favourites</button>
            </div>
      </div>`;
    let favBooksContainer = document.querySelector("#favBooksContainer");
    if (favBooksContainer) {
      favBooksContainer.appendChild(newBookHTML);
    }
  }

  //remove the book from the library
  favBooksContainer.addEventListener("click", function (event) {
    let positionClickRemove = event.target;
    if (positionClickRemove.classList.contains("remove-element")) {
      //removes the card containing the book from HTML
      let selectedBookToBeDeletedHTML =
        positionClickRemove.parentNode.parentNode.parentNode;
      selectedBookToBeDeletedHTML.remove();
      //find the title of the selected card in the 'library' array and remove it;
      let selectedBookTitleD =
        positionClickRemove.previousElementSibling.previousElementSibling
          .previousElementSibling.innerHTML;
      let indexOfBookToBeRemoved = library.findIndex(
        (e) => e.title === selectedBookTitleD
      );
      library.splice(indexOfBookToBeRemoved, 1);
      //update session storage
      addLibraryToMemory();
    }
    if (library.length === 0) {
      p.style.display = "block";
    }
  });

  //add book reviews;
  let reviews = [];
  let reviewTitle = document.querySelector(".textAreaLabel");
  let reviewTextArea = document.querySelector(".textArea");
  let saveReviewButton = document.querySelector(".save-review-button");

  /*find the 'write a review' button that was clicked, get the title of the book
  and the review using the getReview() function */
  favBooksContainer.addEventListener("click", function (event) {
    //find the book that was clicked
    let positionClickAdd = event.target;
    //change the label of the modal with the title of the book
    let labelTitle = positionClickAdd.getAttribute("data-title");
    reviewTitle.textContent = labelTitle;

    //add a name attribute to the textarea that contains the title of the book
    reviewTextArea.setAttribute("name", labelTitle);

    //get the previously added reviews from session storage
    if (sessionStorage.getItem("reviews")) {
      reviews = JSON.parse(sessionStorage.getItem("reviews"));
    }

    //find the review that matches the book's title
    let reviewToBeDisplayed = reviews.find((o) => o.bookName === labelTitle);
    if (reviewToBeDisplayed === undefined) {
      reviewTextArea.value = "";
    } else {
      reviewTextArea.value = reviewToBeDisplayed.review;
    }

    //change the text content and the color of the button that opens the modal, if there is content inside
    saveReviewButton.addEventListener("click", function () {
      positionClickAdd.textContent = "See review";
    });
  });

  saveReviewButton.addEventListener("click", function () {
    /*if a review for a book already exists, when the 'save' button is pressed, delete the initial review, 
    then call the function to add a new review/*/
    let indexExistingReview = reviews.findIndex(
      (r) => r.bookName === reviewTextArea.getAttribute("name")
    );
    if (indexExistingReview !== -1) {
      reviews.splice(indexExistingReview, 1);
    }
    saveReview(reviewTextArea.getAttribute("name"), reviewTextArea.value);
  });

  function saveReview(name, reviewSaved) {
    let bookReview = new Review(name, reviewSaved);
    reviews.push(bookReview);
    addReviewsToMemory();
  }

  //add all the saved reviews in sessionStorage
  function addReviewsToMemory() {
    sessionStorage.setItem("reviews", JSON.stringify(reviews));
    console.log(sessionStorage);
  }

  //building key-value pairs, containing the name and the review of the book
  class Review {
    constructor(name, bookRevewP) {
      this.bookName = name;
      this.review = bookRevewP;
    }
  }

  //enable 'save review' button if textarea is not empty
  reviewTextArea.addEventListener("keyup", function () {
    if (reviewTextArea.value === "") {
      saveReviewButton.disabled = true;
    } else {
      saveReviewButton.disabled = false;
    }
  });
});
