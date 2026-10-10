
import { supabase } from "../config/supabaseClient.js";

export async function getAllMembers() {
    const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("name");

    if (error) throw error;
    return data;
}

export async function getMemberById(id) {
    const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Anggota tidak ditemukan");
    return data;
}

export async function createMember(member) {
    const { data, error } = await supabase
        .from("members")
        .insert(member)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateMember(id, member) {
    const { data, error } = await supabase
        .from("members")
        .update(member)
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Anggota tidak ditemukan");
    return data;
}

export async function deleteMember(id) {
    const { data, error } = await supabase
        .from("members")
        .delete()
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Anggota tidak ditemukan");
    return data;
}
