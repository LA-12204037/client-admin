import { create } from "zustand";
import {
  getFields as getFieldsRequest,
  createField as createFieldRequest,
  updateField as updateFieldRequest,
  deleteField as deleteFieldRequest,
  getAllReservations as getAllReservationsRequest,
  confirmReservation as confirmReservationRequest,
} from "../../../shared/api";

// ================= STORE CAMPOS =================
export const useFieldsStore = create((set, get) => ({
  fields: [],
  reservations: [],
  loading: false,
  error: null,

  // Obtener campos
  getFields: async () => {
    try {
      set({ loading: true, error: null });

      const response = await getFieldsRequest();

      set({
        fields: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Error al obtener canchas",
        loading: false,
      });
    }
  },

  // Crear campo
  createField: async (formData) => {
    try {
      set({ loading: true, error: null });

      const response = await createFieldRequest(formData);

      set({
        fields: [response.data.data, ...get().fields],
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Error al crear campo",
        loading: false,
      });
    }
  },

  // Actualizar campo
  updateField: async (id, formData) => {
    try {
      set({ loading: true, error: null });

      await updateFieldRequest(id, formData);

      await get().getFields();
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Error al actualizar campo",
        loading: false,
      });
    }
  },

  // Eliminar campo
  deleteField: async (id) => {
    try {
      set({ loading: true, error: null });

      await deleteFieldRequest(id);

      await get().getFields();
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Error al eliminar campo",
        loading: false,
      });
    }
  },

  // Reservaciones
  getAllReservations: async () => {
    try {
      set({ loading: true, error: null });

      const response =
        await getAllReservationsRequest();

      set({
        reservations: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Error al obtener reservaciones",
        loading: false,
      });
    }
  },

  confirmReservation: async (id) => {
    try {
      set({ loading: true, error: null });

      await confirmReservationRequest(id);

      await get().getAllReservations();

      set({ loading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Error al confirmar reservación",
        loading: false,
      });
    }
  },
}));

// ================= STORE UI =================
export const useUIStore = create((set) => ({
  openConfirm: ({
    title = "Confirmar",
    message = "¿Deseas continuar?",
    onConfirm,
  }) => {
    const ok = window.confirm(
      `${title}\n\n${message}`
    );

    if (ok && onConfirm) {
      onConfirm();
    }
  },
}));