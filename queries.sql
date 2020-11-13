-- Deletes cascade and remove M:M relationships
--Select all books and corresponding authors.
SELECT Books.bookId, Books.googleId, Books.title, Books.isbn, Books.publisher, Books.publishedDate,
        Books.description, Books.pageCount, Books.rating, Books.price, Books.quantityAvailable,
        GROUP_CONCAT(Authors.authorName ORDER BY Authors.authorName SEPARATOR ', ') Authors
        FROM Books
            LEFT JOIN BookAuthors
                ON Books.bookId = BookAuthors.bookId
            LEFT JOIN Authors
                ON BookAuthors.authorId = Authors.authorId
        GROUP BY Books.bookId;

-- Add a book to the database
INSERT IGNORE INTO Books (googleId, title, isbn, publisher, 
publishedDate, description, pageCount, rating, price, 
quantityAvailable) VALUES (:googleIdInput,:titleInput,:isbnInput,
:publisherInput,:publishedDateInput, :descriptionInput,:pageCountInput,
:ratingInput,:priceInput,:quantityAvailableInput);

--Add a new author to the database
INSERT IGNORE INTO Authors(authorName) VALUES (:authornameInput);

--Add Book and Author Keys to BookAuthors
INSERT IGNORE INTO BookAuthors(bookId, authorId) 
VALUES ((SELECT bookID FROM Books WHERE googleId = :googleIdInput and price = :priceInput),
(SELECT authorId FROM Authors WHERE authorName = :authornameInput));

--Get All Authors and there current connected books
SELECT Authors.authorId, Authors.authorName,
            GROUP_CONCAT(Books.title ORDER BY Books.title SEPARATOR ', ')
            FROM Authors
            LEFT JOIN BookAuthors
                ON Authors.authorId = BookAuthors.authorId
            LEFT JOIN Books
                ON BookAuthors.bookId = Books.bookId
            GROUP BY Authors.authorId;

--Gets the BookAuthors table with book titles and author names
SELECT Books.bookId, Books.title, Authors.authorID, Authors.authorName
        FROM Books
        Join BookAuthors on Books.bookId = BookAuthors.bookId
        JOIN Authors ON BookAuthors.authorId = Authors.authorId;

--Deletes a selected Book
 DELETE FROM Books WHERE Books.bookId = (:bookIdTableId)

 --Updates a book
 UPDATE Books SET googleId= :googleIdInput, title=:titleInput, isbn=:isbnInput, 
        publisher=:publisherInput, publishedDate=:publishedDateInput,
        pageCount=:pageCountInput, rating=:ratingInput, price=:priceInput, 
        quantityAvailable=:quantityAvailableInput Where bookId=:bookIdTableIdInput;

-- Insert an Author
INSERT IGNORE INTO Authors (authorName) VALUES (:authorNameInput);

--Delete an Author
DELETE FROM Authors WHERE Authors.authorId = (:authorIdTableId);

--Update and Authors name
UPDATE Authors Set authorName=:authorNameInput Where authorId = :authorIdTableId



