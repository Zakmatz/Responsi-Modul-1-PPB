
import {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} from "../models/bookModel.js";

// Menampilkan semua buku
export async function getBooks(req, res) {
    try {
        const books = await getAllBooks();
        res.status(200).json({
            success: true,
            data: books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Menampilkan buku berdasarkan ID
export async function getBook(req, res) {
    try {
        const book = await getBookById(req.params.id);
        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
}

// Menambahkan buku
export async function addBook(req, res) {
    try {
        const book = await createBook(req.body);
        res.status(201).json({
            success: true,
            message: "Buku berhasil ditambahkan",
            data: book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// Memperbarui buku
export async function editBook(req, res) {
    try {
        const book = await updateBook(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Buku berhasil diperbarui",
            data: book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// Menghapus buku
export async function removeBook(req, res) {
    try {
        const book = await deleteBook(req.params.id);
        res.status(200).json({
            success: true,
            message: "Buku berhasil dihapus",
            data: book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}