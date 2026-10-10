
import { supabase } from "../config/supabaseClient.js";

// Mengambil tanggal lokal dalam format YYYY-MM-DD
function getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Menghitung status terbaru berdasarkan tanggal dan pengembalian
export function calculateLoanStatus(loan) {
    if (loan.return_date) {
        return "Dikembalikan";
    }

    if (loan.due_date < getToday()) {
        return "Terlambat";
    }

    return "Dipinjam";
}

// Menambahkan status hasil perhitungan ke data peminjaman
function addCalculatedStatus(loan) {
    return {
        ...loan,
        status: calculateLoanStatus(loan)
    };
}

// Mengambil seluruh peminjaman dan memfilter status
export async function getAllLoans(status) {
    const { data, error } = await supabase
        .from("loans")
        .select(`
      *,
      members (id, name, email),
      books (id, title, author, isbn)
    `)
        .order("created_at", { ascending: false });

    if (error) throw error;

    const loans = data.map(addCalculatedStatus);

    if (status) {
        return loans.filter((loan) => loan.status === status);
    }

    return loans;
}

// Mengambil satu peminjaman berdasarkan ID
export async function getLoanById(id) {
    const { data, error } = await supabase
        .from("loans")
        .select(`
      *,
      members (id, name, email),
      books (id, title, author, isbn)
    `)
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;

    if (!data) {
        throw new Error("Data peminjaman tidak ditemukan");
    }

    return addCalculatedStatus(data);
}

// Membuat transaksi peminjaman
export async function createLoan(loan) {
    const { data, error } = await supabase
        .from("loans")
        .insert(loan)
        .select()
        .single();

    if (error) throw error;

    return data;
}

// Memperbarui data peminjaman
export async function updateLoan(id, loan) {
    const { data, error } = await supabase
        .from("loans")
        .update(loan)
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) throw error;

    if (!data) {
        throw new Error("Data peminjaman tidak ditemukan");
    }

    return data;
}

// Menghapus transaksi peminjaman
export async function deleteLoan(id) {
    const { data, error } = await supabase
        .from("loans")
        .delete()
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) throw error;

    if (!data) {
        throw new Error("Data peminjaman tidak ditemukan");
    }

    return data;
}
