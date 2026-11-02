
const express = require('express');

const app = express();

app.use(express.json());

let books = [];

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


app.get('/api/books', (req, res) => {

    if (books.length === 0) {
        return res.json({
            message: "No books available",
            books: []
        });
    }

    res.json(books);

});



app.get('/api/books/search', (req, res) => {

    const title = req.query.title || "";

    const result = books.filter(b =>
        b.title.toLowerCase().includes(title.toLowerCase())
    );

    res.json(result);

});



app.get('/api/books/:id', (req, res) => {

    const book = books.find(b => b.id === Number(req.params.id));

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);

});

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

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

