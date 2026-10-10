
import * as Loan from "../models/loanModel.js";

const validStatuses = [
    "Dipinjam",
    "Dikembalikan",
    "Terlambat"
];

function handleError(res, error) {
    const message = error.message || "Terjadi kesalahan";

    const statusCode = message.includes("tidak ditemukan")
        ? 404
        : 400;

    return res.status(statusCode).json({
        success: false,
        message
    });
}

// GET semua peminjaman atau filter berdasarkan status
export async function getLoans(req, res) {
    try {
        const { status } = req.query;

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Status harus Dipinjam, Dikembalikan, atau Terlambat"
            });
        }

        const loans = await Loan.getAllLoans(status);

        return res.status(200).json({
            success: true,
            total: loans.length,
            data: loans
        });
    } catch (error) {
        return handleError(res, error);
    }
}

// GET satu peminjaman berdasarkan ID
export async function getLoan(req, res) {
    try {
        const loan = await Loan.getLoanById(req.params.id);

        return res.status(200).json({
            success: true,
            data: loan
        });
    } catch (error) {
        return handleError(res, error);
    }
}

// POST membuat peminjaman baru
export async function addLoan(req, res) {
    try {
        const { member_id, book_id, due_date } = req.body;

        if (!member_id || !book_id || !due_date) {
            return res.status(400).json({
                success: false,
                message:
                    "member_id, book_id, dan due_date wajib diisi"
            });
        }

        // Validasi format tanggal YYYY-MM-DD
        const validDateFormat = /^\d{4}-\d{2}-\d{2}$/;

        if (!validDateFormat.test(due_date)) {
            return res.status(400).json({
                success: false,
                message: "due_date harus berformat YYYY-MM-DD"
            });
        }

        const parsedDueDate = new Date(`${due_date}T00:00:00Z`);

        if (
            Number.isNaN(parsedDueDate.getTime()) ||
            parsedDueDate.toISOString().slice(0, 10) !== due_date
        ) {
            return res.status(400).json({
                success: false,
                message: "Tanggal jatuh tempo tidak valid"
            });
        }

        // Mengambil tanggal hari ini
        const today = new Date();
        const todayString = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        if (due_date < todayString) {
            return res.status(400).json({
                success: false,
                message: "Tanggal jatuh tempo tidak boleh di masa lalu"
            });
        }

        const loan = await Loan.createLoan({
            member_id,
            book_id,
            loan_date: todayString,
            due_date,
            status: "Dipinjam"
        });

        return res.status(201).json({
            success: true,
            message: "Peminjaman berhasil ditambahkan",
            data: loan
        });
    } catch (error) {
        return handleError(res, error);
    }
}

// PUT memperbarui data atau memproses pengembalian
export async function editLoan(req, res) {
    try {
        const id = req.params.id;
        const { status, return_date, due_date, loan_date } = req.body;

        // Pastikan transaksi peminjaman tersedia
        const existingLoan = await Loan.getLoanById(id);

        // Memproses pengembalian buku
        if (status === "Dikembalikan") {
            // Periksa return_date secara langsung dari objek peminjaman
            if (existingLoan.return_date) {
                return res.status(400).json({
                    success: false,
                    message: "Buku ini sudah ditandai dikembalikan"
                });
            }

            const today = new Date();
            const todayString = [
                today.getFullYear(),
                String(today.getMonth() + 1).padStart(2, "0"),
                String(today.getDate()).padStart(2, "0")
            ].join("-");

            const loan = await Loan.updateLoan(id, {
                return_date: return_date || todayString,
                status: "Dikembalikan"
            });

            return res.status(200).json({
                success: true,
                message: "Buku berhasil dikembalikan",
                data: loan
            });
        }

        // Status Terlambat dihitung otomatis oleh sistem
        if (status === "Terlambat") {
            return res.status(400).json({
                success: false,
                message:
                    "Status Terlambat dihitung otomatis berdasarkan due_date"
            });
        }

        // Status Dipinjam ditetapkan saat peminjaman dibuat
        if (status === "Dipinjam") {
            return res.status(400).json({
                success: false,
                message:
                    "Status Dipinjam ditentukan otomatis. Gunakan proses peminjaman baru."
            });
        }

        // Memperbarui tanggal peminjaman atau jatuh tempo
        const updates = {};

        if (due_date !== undefined) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(due_date)) {
                return res.status(400).json({
                    success: false,
                    message: "due_date harus berformat YYYY-MM-DD"
                });
            }

            updates.due_date = due_date;
        }

        if (loan_date !== undefined) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(loan_date)) {
                return res.status(400).json({
                    success: false,
                    message: "loan_date harus berformat YYYY-MM-DD"
                });
            }

            updates.loan_date = loan_date;
        }

        if (return_date !== undefined) {
            return res.status(400).json({
                success: false,
                message:
                    "Gunakan status Dikembalikan untuk mencatat pengembalian"
            });
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Masukkan due_date atau loan_date, atau gunakan status Dikembalikan"
            });
        }

        const updatedLoan = await Loan.updateLoan(id, updates);

        // Ambil kembali data agar status mengikuti perhitungan terbaru
        const loan = await Loan.getLoanById(updatedLoan.id);

        return res.status(200).json({
            success: true,
            message: "Data peminjaman berhasil diperbarui",
            data: loan
        });
    } catch (error) {
        return handleError(res, error);
    }
}

// DELETE menghapus transaksi peminjaman
export async function removeLoan(req, res) {
    try {
        const loan = await Loan.deleteLoan(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Data peminjaman berhasil dihapus",
            data: loan
        });
    } catch (error) {
        return handleError(res, error);
    }
}
