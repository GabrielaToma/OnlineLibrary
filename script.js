$(document).ready(function () {
  console.log("hello world");

  //enabling tooltips with bootstrap
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );

  let book, title, author, bookLink, bookImg, bookDescription, bookId1;
  let book2, title2, author2, bookLink2, bookImg2, bookDescription2, bookId2;

  let bookURL = "https://www.googleapis.com/books/v1/volumes?q=";
  let apiKey = "AIzaSyDh3E43dXgVWUxwakvvR487Emy6APe73Ak";
  let booksResult = document.querySelector(".books-result");
  let modalBody = document.querySelector(".modal-body");
  let searchBooks = $("#search-books");
  let searchData;
  let books = [];
  let booksIds = [];
  let bookId;
  let library = [];

  //listener search button
  $(".sp-submit").click(function (e) {
    e.preventDefault();
    /*clear the ".books-result" div when the form is submitted,
      so the previos search results dissapear*/
    booksResult.innerHTML = "";
    //give the searchData variable the value of the input
    searchData = searchBooks.val();
    //handing empty input field
    if (searchData === "") {
      alert("Please complete field");
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
      searchData = searchBooks.val();
      //handing empty input field
      if (searchData === "") {
        alert("Please complete field");
      } else {
        getBookFromGoogle(searchData);
      }
    }
  });

  const getBookFromGoogle = async (param) => {
    try {
      const response = await fetch(`${bookURL}${param}&key=${apiKey}`);
      console.log(response);
      const data = await response.json();
      console.log(data);
      books = data.items;
      //book va contine o matrice cu toate rezultatele in forma de obiecte

      //save the ids of the books in an array
      for (let i = 0; i < books.length; i++) {
        let id = books[i].id;
        booksIds.push(id);
        console.log(booksIds);
      }

      for (let i = 0; i < books.length; i += 2) {
        book = books[i].volumeInfo;
        console.log(book);
        title = book.title;
        author = book.authors[0];
        bookLink = book.previewLink;
        bookImg = book.imageLinks.thumbnail;
        bookDescription = book.description;
        bookId1 = books[i].id;

        console.log(bookDescription);

        book2 = books[i + 1].volumeInfo;
        title2 = book2.title;
        author2 = book2.authors[0];
        bookLink2 = book2.previewLink;
        bookImg2 = book2.imageLinks.thumbnail;
        bookDescription2 = book2.description;
        bookId2 = books[i + 1].id;

        booksResult.innerHTML +=
          '<div class="row gy-5 mt-3 mb-3 d-flex justify-content-around">' +
          formatResults(
            title,
            author,
            bookLink,
            bookImg,
            bookDescription,
            bookId1
          ) +
          formatResults(
            title2,
            author2,
            bookLink2,
            bookImg2,
            bookDescription2,
            bookId2
          ) +
          "</div>";

        console.log(booksResult);
      }
    } catch (e) {
      console.log("ERROR", e);
      alert("Something went wrong, try again!");
    }
  };

  function formatResults(
    title,
    author,
    bookLink,
    bookImg,
    description,
    bookId
  ) {
    let htmlCard = `<div class="col-8 col-sm-10 col-lg-5" >
    <div class="card" data-id="${bookId}" style="height:auto; background-color: rgb(231, 225, 213);border: 0;box-shadow: 5px 10px 18px gray;">
      <div class="row no-gutters"> 
        <div class="col-sm-4">
          <img src="${bookImg}" class="card-img" style="width: 100%; height: 13em" alt="image displaying the cover of the book ${title}">
        </div>
        <div class="col-sm-8">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">Author: ${author}</p>
            <button type="button" class="btn px-0" style="color:rgb(101, 4, 101);" onMouseOver = "this.style.color='#F8F8F8'" onMouseOut = "this.style.color='black'" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="${description}">
              View description
            </button>
            <a target="_blank" href="${bookLink}" class="btn px-3" style="color:rgb(101, 4, 101);" onMouseOver = "this.style.color='#F8F8F8'" onMouseOut = "this.style.color='black'" >View book</a>
            <button type="button" class="add-to-library" data-link="${bookLink}" data-title="${title}" data-img="${bookImg}" data-author="${author}">&hearts; 
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
    return htmlCard;
  }

  //select the book and its specifications
  booksResult.addEventListener("click", function (event) {
    let positionClick = event.target;
    if (positionClick.classList.contains("add-to-library")) {
      let selectedBookTitle = positionClick.getAttribute("data-title");
      let selectedBookLink = positionClick.getAttribute("data-link");
      let selectedBookImg = positionClick.getAttribute("data-img");
      let selectedBookAuthor = positionClick.getAttribute("data-author");
      addToStorage(
        selectedBookTitle,
        selectedBookLink,
        selectedBookAuthor,
        selectedBookImg
      );
      addCardToLibrary(
        selectedBookTitle,
        selectedBookLink,
        selectedBookAuthor,
        selectedBookImg
      );
    }
  });

  //add book to session storage
  //1 creating a class template for js objects
  class Favourite {
    constructor(title, author, image, link) {
      this.title = title;
      this.author = author;
      this.image = image;
      this.link = link;
    }
  }
  //2 creating an array that contains objects representing each book selected
  function addToStorage(
    selectedBookTitle,
    selectedBookLink,
    selectedBookAuthor,
    selectedBookImg
  ) {
    let newFavourite = new Favourite(
      selectedBookTitle,
      selectedBookLink,
      selectedBookAuthor,
      selectedBookImg
    );
    library.push(newFavourite);
    console.log(library);
    /*saving the library in session storage, to be able to see the cards in the library page, 
    even if the search page changes*/
    sessionStorage.setItem("favBooks", JSON.stringify(library));
    console.log(sessionStorage);
  }

  //adding the card to the library page
  function addCardToLibrary(
    selectedBookTitle,
    selectedBookLink,
    selectedBookAuthor,
    selectedBookImg
  ) {
    let newBook = document.createElement("div");
    newBook.classList.add("col-sm", "col-md-4", "col-lg-3");
    newBook.innerHTML = `<div class="card" style="width: 18rem">
            <img src="${selectedBookImg}" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">${selectedBookTitle}</h5>
              <p class="card-text">
                ${selectedBookAuthor}
              </p>
              <a href="${selectedBookLink}" class="btn btn-primary">Go somewhere</a>
            </div>
      </div>`;
    let favBooksContainer = document.querySelector("#favBooksContainer");
    if (favBooksContainer !== null) {
      console.log("it exists!");
    }
    console.log(newBook);
  }

  //view book description
  const exampleModal = document.getElementById("exampleModal");

  function viewDescription(description) {
    if (exampleModal) {
      exampleModal.addEventListener("show.bs.modal", (event) => {
        // Button that triggered the modal
        const button = event.relatedTarget;
        const descriptionAttribute = button.getAttribute("data-bs-whatever");
        modalBody.textContent = descriptionAttribute;
        if (modalBody.textContent === "undefined") {
          modalBody.textContent =
            "Sorry! No description is available for this book.";
        }
      });
    }
  }

  viewDescription(bookDescription);
});

/*
- am reusit sa le accesez!
- trebuie sa creez template-ul unui card pe pagina html library;
- sa creez acum un card folosind proprietatile info e destul de usor, dar cum le fac sa ramana pana se inchide tab-ul?
- session storage? 
- dupa ce le accesez, le salvez intr un obiect caruia ii dau push in matricea library
- creez un obiect care sa contina informatiile despre cartea respectiva
- salvez obiectul in session storage
*/
