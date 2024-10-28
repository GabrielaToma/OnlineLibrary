$(document).ready(function () {
  console.log("hello world");

  //enabling tooltips with bootstrap
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );

  let book, title, author, bookLink, bookImg, bookDescription;
  let book2, title2, author2, bookLink2, bookImg2, bookDescription2;

  let bookURL = "https://www.googleapis.com/books/v1/volumes?q=";
  let apiKey = "AIzaSyDh3E43dXgVWUxwakvvR487Emy6APe73Ak";
  let booksResult = document.querySelector(".books-result");
  let form = $(".form");
  let searchBooks = $("#search-books");
  let searchData;

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

  const getBookFromGoogle = async (param) => {
    try {
      const response = await fetch(`${bookURL}${param}&key=${apiKey}`);
      console.log(response);
      const data = await response.json();
      console.log(data);
      const books = data.items;
      //book va contine o matrice cu toate rezultatele in forma de obiecte
      console.log(books);
      for (let i = 0; i < books.length; i += 2) {
        book = books[i].volumeInfo;
        title = book.title;
        author = book.authors[0];
        bookLink = book.previewLink;
        bookImg = book.imageLinks.thumbnail;
        bookDescription = book.description;

        book2 = books[i + 1].volumeInfo;
        title2 = book2.title;
        author2 = book2.authors[0];
        bookLink2 = book2.previewLink;
        bookImg2 = book2.imageLinks.thumbnail;
        bookDescription2 = book2.description;

        booksResult.innerHTML +=
          '<div class="row mt-5 d-flex justify-content-around">' +
          formatResults(title, author, bookLink, bookImg, bookDescription) +
          formatResults(
            title2,
            author2,
            bookLink2,
            bookImg2,
            bookDescription2
          ) +
          "</div>";
        console.log(booksResult);
      }
    } catch (e) {
      console.log("ERROR", e);
      alert("Something went wrong, try again!");
    }
  };

  function formatResults(title, author, bookLink, bookImg, bookDescription) {
    let htmlCard = `<div class="col-lg-5">
    <div class="card h-100" style="background-color: rgb(210, 154, 195);">
      <div class="row no-gutters">
        <div class="col-md-4">
          <img src="${bookImg}" class="card-img" alt="image displaying the cover of the book ${title}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">Author: ${author}</p>
            <a target="_blank" href="${bookLink}" class="btn btn-secondary">View Book</a>
          </div>
        </div>
      </div>
    </div>
  </div>`;
    return htmlCard;
  }
});
