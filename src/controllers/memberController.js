
import * as Member from "../models/memberModel.js";

function handleError(res, error) {
    res.status(400).json({
        success: false,
        message: error.message
    });
}

export async function getMembers(req, res) {
    try {
        res.json({ success: true, data: await Member.getAllMembers() });
    } catch (error) {
        handleError(res, error);
    }
}

export async function getMember(req, res) {
    try {
        res.json({ success: true, data: await Member.getMemberById(req.params.id) });
    } catch (error) {
        handleError(res, error);
    }
}

export async function addMember(req, res) {
    try {
        res.status(201).json({
            success: true,
            message: "Anggota berhasil ditambahkan",
            data: await Member.createMember(req.body)
        });
    } catch (error) {
        handleError(res, error);
    }
}

export async function editMember(req, res) {
    try {
        res.json({
            success: true,
            message: "Anggota berhasil diperbarui",
            data: await Member.updateMember(req.params.id, req.body)
        });
    } catch (error) {
        handleError(res, error);
    }
}

export async function removeMember(req, res) {
    try {
        res.json({
            success: true,
            message: "Anggota berhasil dihapus",
            data: await Member.deleteMember(req.params.id)
        });
    } catch (error) {
        handleError(res, error);
    }
}
