import { axiosAdmin } from "../api";
 
// ================= TOURNAMENTS =================
export const getTournaments = async () => {
    return await axiosAdmin.get("/tournaments");
};
 
export const createTournament = async (data) => {
    return await axiosAdmin.post("/tournaments", data);
};
 
export const updateTournament = async (id, data) => {
    return await axiosAdmin.put(`/tournaments/${id}`, data);
};
 
export const deleteTournament = async (id) => {
    return await axiosAdmin.put(`/tournaments/${id}/deactivate`);
};
 
// ================= TEAMS =================
export const getTeams = async () => {
    return await axiosAdmin.get("/teams");
};
 
export const createTeam = async (data) => {
    return await axiosAdmin.post("/teams", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
 
export const updateTeam = async (id, data) => {
    return await axiosAdmin.put(`/teams/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
 
export const deleteTeam = async (id) => {
    return await axiosAdmin.put(`/teams/${id}/deactivate`);
};
 
// ================= FIELDS =================
export const getFields = async () => {
    return await axiosAdmin.get("/fields");
};
 
export const createField = async (data) => {
    return await axiosAdmin.post("/fields", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
 
export const updateField = async (id, data) => {
    return await axiosAdmin.put(`/fields/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
 
export const deleteField = async (id) => {
    return await axiosAdmin.put(`/fields/${id}/deactivate`);
};
 
// ================= RESERVATIONS =================
export const getAllReservations = async () => {
    return await axiosAdmin.get("/reservations");
};
 
export const confirmReservation = async (id) => {
    return await axiosAdmin.put(`/reservations/${id}/confirm`);
};
 
import { create } from "zustand";
import {
  getFields as getFieldsRequest,
  createField as createFieldRequest,
  updateField as _updateFieldRequest,
  deleteField as _deleteFieldRequest,
  getAllReservations as getAllReservationsRequest,
  confirmReservation as confirmReservationRequest,
} from "../../../shared/api";
 
export const useFieldsStore = create((set, get) => ({
  fields: [],
  reservations: [],
  loading: false,
  error: null,
 
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
        error: error.response?.data?.message || "Error al obtener canchas",
        loading: false,
      });
    }
  },
 
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
        loading: false,
        error: error.response?.data?.message || "Error al crear campo",
      });
    }
  },
  // ...rest of logic
 
  getAllReservations: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getAllReservationsRequest();
      set({
        reservations: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error al obtener reservaciones",
        loading: false,
      });
    }
  },
 
  confirmReservation: async (id) => {
    try {
      set({ loading: true, error: null });
      await confirmReservationRequest(id);
      // Refrescar lista después de confirmar
      await get().getAllReservations();
      set({ loading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error al confirmar reservación",
        loading: false,
      });
    }
  },
}));
 