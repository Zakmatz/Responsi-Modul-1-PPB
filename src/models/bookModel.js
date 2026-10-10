
import { supabase } from "../config/supabaseClient.js";

export async function getAllBooks() {
    const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("title", { ascending: true });

    if (error) throw error;
    return data;
}

export async function getBookById(id) {
    const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
}

export async function createBook(book) {
    const { data, error } = await supabase
        .from("books")
        .insert(book)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateBook(id, book) {
    const { data, error } = await supabase
        .from("books")
        .update(book)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteBook(id) {
    const { data, error } = await supabase
        .from("books")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}
