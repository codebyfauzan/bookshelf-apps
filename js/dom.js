const INCOMPLETE_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

function searchBook() {
    const searchBookTitle = document.getElementById("searchBookTitle").value.toUpperCase();
    const bookItem = document.getElementsByClassName("book_item");

    for(let i = 0; i < bookItem.length; i++) {
        const h3 = bookItem[i].getElementsByTagName("h3")[0];
        const textTitle = h3.innerText.toUpperCase();
        if(textTitle.indexOf(searchBookTitle) > -1) {
            bookItem[i].style.display = "";
        } else {
            bookItem[i].style.display = "none";
        }
    }
        
}

function addBook() {
    const incompleteBookList = document.getElementById(INCOMPLETE_LIST_BOOK_ID);
    const completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);

    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const bookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const toast = document.getElementById("toast");
    document.querySelector("#toast p").innerText = 'Book data saved successfully';
    toast.className = "show";
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);

    if(bookIsComplete) {
        const book = makeBook(bookTitle, bookAuthor, bookYear, true);
        const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, true);
        book[BOOK_ITEMID] = bookObject.id;
        book.id = bookObject.id;
        books.push(bookObject);
        completedBookList.append(book);
    } else {
        const book = makeBook(bookTitle, bookAuthor, bookYear, false);
        const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, false);
        book[BOOK_ITEMID] = bookObject.id;
        book.id = bookObject.id;
        books.push(bookObject);
        incompleteBookList.append(book);
    }
    // console.log(books[books.length - 1].id);
    document.getElementById(books[books.length - 1].id).style.border = '2px solid black';
    setTimeout(function(){ 
        document.getElementById(books[books.length - 1].id).style.border = 'none';
    }, 6000);

    updateDataToStorage();
}

function makeBook(title, author, year, isCompleted) {

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Author : '+author;

    const textYear = document.createElement('p');
    textYear.innerText = 'Year : '+year;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');

    const completedButton = createCompletedButton();
    completedButton.innerText = 'Finished Reading';

    const deleteButton = createDeleteButton();
    deleteButton.innerText = 'Delete Book';

    const undoButton = createUndoButton();
    undoButton.innerText = 'Unfinished Reading';

    if(isCompleted) {
        buttonContainer.append(undoButton, deleteButton);
    } else {
        buttonContainer.append(completedButton, deleteButton);
    }

    const containerBookItem = document.createElement('article');
    containerBookItem.classList.add('book_item');
    containerBookItem.append(textTitle, textAuthor, textYear, buttonContainer);

    return containerBookItem;
}

function createButton(buttonTypeClass , eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function addBookToCompleted(bookElement) {
    const completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const textBookTitle = bookElement.querySelector('h3').innerText;
    const textBookAuthor = bookElement.querySelector('p:first-of-type').innerText;
    const textBookYear = bookElement.querySelector('p:last-of-type').innerText;

    const completedBook = makeBook(
        textBookTitle, 
        textBookAuthor.substr(10, textBookAuthor.length), 
        textBookYear.substr(8, textBookYear.length), 
        true);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = true;
    completedBook[BOOK_ITEMID] = book.id;
    
    completedBookList.append(completedBook);
    bookElement.remove();

    updateDataToStorage();
}

function createCompletedButton() {
    return createButton('completed', function(event) {
        addBookToCompleted(event.target.parentElement.parentElement);
    })
}

function removeBookFromCompleted(bookElement) {
    const toast = document.getElementById("toast");
    document.querySelector("#toast p").innerText = 'Book data deleted successfully';
    toast.className = "show";
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);

    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    updateDataToStorage();
}

function createDeleteButton() {
    return createButton('delete', function(event) {
        removeBookFromCompleted(event.target.parentElement.parentElement);
    })
}

function undoBookFromCompleted(bookElement) {
    const incompleteBookList = document.getElementById(INCOMPLETE_LIST_BOOK_ID);
    const textBookTitle = bookElement.querySelector('h3').innerText;
    const textBookAuthor = bookElement.querySelector('p:first-of-type').innerText;
    const textBookYear = bookElement.querySelector('p:last-of-type').innerText;

    const completedBook = makeBook(
        textBookTitle, 
        textBookAuthor.substr(10, textBookAuthor.length), 
        textBookYear.substr(8, textBookYear.length), 
        false);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;
    completedBook[BOOK_ITEMID] = book.id;

    
    incompleteBookList.append(completedBook);
    bookElement.remove();

    updateDataToStorage();
}

function createUndoButton() {
    return createButton('completed', function(event) {
        undoBookFromCompleted(event.target.parentElement.parentElement);
    })
}

function smoothScroll(target, duration) {
    let item = document.getElementById(target);
    let itemPosition = item.getBoundingClientRect().top;
    let startPosition = window.scrollY;
    let distance = itemPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        let timeElapsed = currentTime - startTime;
        let run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };


    requestAnimationFrame(animation);
}