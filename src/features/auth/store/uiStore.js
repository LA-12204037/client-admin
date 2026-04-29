import { create } from "zustand";

export const useUIStore = create((set) => ({
  modal: null,
  confirm: null,

  // ================= MODAL =================
  openModal: (title, message, onClose = null) =>
    set({
      modal: {
        title,
        message,
        onClose,
      },
    }),

  closeModal: () =>
    set({
      modal: null,
    }),

  // ================= CONFIRM =================
  openConfirm: (
    title,
    message,
    onConfirm = null,
    onCancel = null
  ) =>
    set({
      confirm: {
        title,
        message,
        onConfirm,
        onCancel,
      },
    }),

  closeConfirm: () =>
    set({
      confirm: null,
    }),
}));