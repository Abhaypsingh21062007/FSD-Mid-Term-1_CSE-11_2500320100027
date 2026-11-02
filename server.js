
const express = require('express');

const app = express();

app.use(express.json());

// Temporary array to store books
let books = [];


// TASK 2: ADD NEW BOOK
// POST /api/books

app.post('/api/books', (req, res) => {

    const { id, author, title, category, quantity, available } = req.body;

    if (!id || !author || !title || !category ||
        quantity < 0 || available < 0 || available > quantity ||
        !Number.isInteger(quantity) || !Number.isInteger(available)) {

        return res.status(400).json({
            message: "Invalid book details"
        });
    }

    const exists = books.find(b => b.id === id);

    if (exists) {
        return res.status(400).json({
            message: "Book ID already exists"
        });
    }

    const book = {
        id,
        author,
        title,
        category,
        quantity,
        available
    };

    books.push(book);

    res.status(201).json({
        message: "Book added successfully",
        book
    });

});


// TASK 3: VIEW ALL BOOKS
// GET /api/books

app.get('/api/books', (req, res) => {

    if (books.length === 0) {
        return res.json({
            message: "No books available",
            books: []
        });
    }

    res.json(books);

});


// TASK 6: SEARCH BOOKS
// GET /api/books/search?title=Java

app.get('/api/books/search', (req, res) => {

    const title = req.query.title || "";

    const result = books.filter(b =>
        b.title.toLowerCase().includes(title.toLowerCase())
    );

    res.json(result);

});


// TASK 3: VIEW BOOK BY ID
// GET /api/books/:id

app.get('/api/books/:id', (req, res) => {

    const book = books.find(b => b.id === Number(req.params.id));

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);

});


// TASK 4: UPDATE BOOK
// PUT /api/books/:id

app.put('/api/books/:id', (req, res) => {

    const book = books.find(b => b.id === Number(req.params.id));

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { author, title, category, quantity, available } = req.body;

    if (!author || !title || !category ||
        !Number.isInteger(quantity) ||
        !Number.isInteger(available) ||
        quantity < 0 || available < 0 || available > quantity) {

        return res.status(400).json({
            message: "Invalid book details"
        });
    }

    book.author = author;
    book.title = title;
    book.category = category;
    book.quantity = quantity;
    book.available = available;

    res.json({
        message: "Book updated successfully",
        book
    });

});


// TASK 5: DELETE BOOK
// DELETE /api/books/:id

app.delete('/api/books/:id', (req, res) => {

    const index = books.findIndex(b => b.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.json({
        message: "Book deleted successfully"
    });

});


// TASK 7: ISSUE BOOK
// POST /api/books/:id/issue

app.post('/api/books/:id/issue', (req, res) => {

    const book = books.find(b => b.id === Number(req.params.id));

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.available <= 0) {
        return res.json({
            message: "No copies available"
        });
    }

    book.available--;

    res.json({
        message: "Book issued successfully",
        book
    });

});


// TASK 7: RETURN BOOK
// POST /api/books/:id/return

app.post('/api/books/:id/return', (req, res) => {

    const book = books.find(b => b.id === Number(req.params.id));

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.available >= book.quantity) {
        return res.json({
            message: "All copies already returned"
        });
    }

    book.available++;

    res.json({
        message: "Book returned successfully",
        book
    });

});


// START SERVER

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
