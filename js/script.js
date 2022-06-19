document.addEventListener("DOMContentLoaded", function() {
    
    const submitBook = document.getElementById("inputBook");
    const isComplete = document.getElementById("inputBookIsComplete");
    const submitStatus = document.querySelector("#bookSubmit span");
    const submitSearchBook = document.getElementById("searchBook");

    submitSearchBook.addEventListener("submit", function(event) {
        event.preventDefault();
        searchBook();
    });

    isComplete.addEventListener("click", function(event) {
        if(event.target.checked) {
            submitStatus.innerText = 'Finished Reading';
        } else {
            submitStatus.innerText = 'Unfinished Reading';
        }
    })

    submitBook.addEventListener("submit", function(event) {
        event.preventDefault();
        addBook();
        // document.getElementById(books[books.length - 1].id).scrollIntoView();
        smoothScroll(books[books.length - 1].id, 1200);
        console.log(document.querySelector("body").scrollTop);
        document.getElementById("inputBookTitle").value = '';
        document.getElementById("inputBookAuthor").value = '';
        document.getElementById("inputBookYear").value = '';
        document.getElementById("inputBookIsComplete").checked = false;
        submitStatus.innerText = 'Belum selesai dibaca';
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan ke dalam local storage.");
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});