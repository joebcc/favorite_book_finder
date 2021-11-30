import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser';
import Books from './data/books';
import './App.scss';
import './searchBar.scss';

let booksAPI = new Books();

const compareStrings = (strA, strB) => {
  strA = strA.toLowerCase();
  strB = strB.toLowerCase();
  return strA.includes(strB);
}

class App extends Component {   
  constructor(props){ 
    super(props) 
        
    this.state = {
      search: "",
      matchingBooks: [],
      matchingAuthors: [],
      books: [],
      loaded: false
    };

    this.handleInput = this.handleInput.bind(this);
  }  

  componentDidMount () {
    booksAPI.askListBooks().then(
      (data) => {
      this.setState({ 
        books: data,
        loaded: true
      })}, 
      (error) => console.error(error)
    )
  }

  handleInput = event => {
    let searchValue = event?.target.value ?? '';
    let matchingBooks = this.state.books?.filter(current => 
      compareStrings(current.title,searchValue)
    );
    let matchingAuthorBooks = this.state.books?.filter(current => 
      compareStrings(current.author, searchValue)
    );
    let matchingAuthors = [];
    matchingAuthorBooks.forEach(
      (cur) => 
      matchingAuthors.includes(cur.author) ? 
        null 
      : matchingAuthors.push(cur.author)
    );
    let totalMatches = matchingBooks.length + matchingAuthorBooks.length;

    this.setState({ 
      search: searchValue,
      matchingBooks,
      matchingAuthors,
      matchingAuthorBooks,
      totalMatches
    }); 

  };


  render(){ 
    return (
      <main className="App">
        {
          this.loaded ? 
            <div className="loading">Loading data</div>
          : null
        }
        <div className="bookfinder">
          <h1 className="bookfinder-title">Find your favorite books</h1>
          <div className={
            "bookfinder-search"
            + (this.state.search.length ? ' has-input' : '' ) 
          }>
            <input type="text" className="search-bar" onChange={this.handleInput}  placeholder="Search by title or author" />
            {
              this.state.search.length ?
                <div className="bookfinder-results-popup">
                  {
                    this.state.totalMatches === 0 ?
                      this.noResults()
                    : this.state.matchingBooks?.length > 0 ?
                      this.bookResults()
                    : null
                  } {
                    this.state.matchingAuthorBooks?.length > 0 ?
                      this.authorResults()
                    : null
                  }
                </div>
              : null
            }
          </div>
        </div>
      </main>
    );
  }

  noResults = () => {
    return (
      <div className="results-no-matches">
        No Matches
      </div>
    )
  }

  bookResults = () => {
    return (
        <div className="results-books">
          <div className="popup-subtitle">Books</div>
          <ul className="popup-list">
            {
              this.state.matchingBooks.map((book) => {
                return <li key={book.id} className="popup-result">
                  <div className="result-title">{
                    ReactHtmlParser(
                      this.boldedSearchTermResult(this.state.search, book.title)
                    )
                  }</div>
                  <div className="result-subtitle">{book.author} - Published in {book.year}</div>
                </li>
              })
            }
          </ul>
        </div>
    )
  }

  authorResults = () => {
    return (
        <div className="results-authors">
          <div className="popup-subtitle">Authors</div>
          <ul className="popup-list">
            {
              this.state.matchingAuthors.map((author) => {
                return <li key={author} className="popup-result">
                  <div className="result-title">{
                    ReactHtmlParser(
                      this.boldedSearchTermResult(this.state.search,author)
                    )
                  }</div>
                  <div className="result-subtitle">Wrote {
                    this.authoredBookList(author)
                  }</div>
                </li>
              })
            }
          </ul>
        </div>
    )
  }
  
  boldedSearchTermResult = (search, booktitle) => {
    let regex = new RegExp(search, 'gi');
    let bolded = (a) => '<b>' + a + '</b>';
    return booktitle.replace(regex, bolded('$&'));
  }

  authoredBookList = (author) => {
    const authoredBooks = this.state.matchingAuthorBooks.filter(cur => cur.author === author);
    return authoredBooks.map(
      (book, ind) => 
        authoredBooks.length === 1 ?
          `"${book.title}"`     // lone book
        : ind + 1 < authoredBooks.length ?
          `"${book.title}", `   // not last in list
        : `& "${book.title}"`   // last in list
    )
  }

}

export default App;
