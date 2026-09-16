import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  deletePreCycleRegistration,
  getPreCycleRegistrations,
  registerToPreCycle,
  updatePreCycleRegistration,
} from "../services/preCycleService";

const editablePreCycleFields = [
  "nombre",
  "apellido",
  "edad",
  "fechaNacimiento",
  "dni",
  "email",
  "telefono",
  "foto",
  "tituloSecundario",
  "concurreAlgunaIglesias",
  "cual",
];

const blurActiveElement = () => {
  if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

export const usePreCycleRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formEditData, setFormEditData] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRegistrations = useCallback(async () => {
    setTableLoading(true);
    try {
      const data = await getPreCycleRegistrations();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar registros:", error);
      toast.error("Error al cargar las pre-inscripciones");
    } finally {
      setTableLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleOpenCreate = () => {
    blurActiveElement();
    setFormEditData(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (registration, event) => {
    event?.stopPropagation?.();
    blurActiveElement();
    setFormEditData(registration);
    setFormModalOpen(true);
  };

  const handleFormClose = () => {
    setFormModalOpen(false);
    setFormEditData(null);
  };

  const handleFormSave = async (formData) => {
    setFormLoading(true);
    try {
      const registrationData = Object.fromEntries(
        editablePreCycleFields
          .filter((field) => Object.hasOwn(formData, field))
          .map((field) => [field, formData[field]]),
      );

      if (formEditData) {
        await updatePreCycleRegistration(formEditData.registrarId, registrationData);
        toast.success("Pre-inscripción actualizada con éxito");
      } else {
        await registerToPreCycle(registrationData);
        toast.success("Pre-inscripción registrada con éxito");
      }

      handleFormClose();
      await fetchRegistrations();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Error al procesar la pre-inscripción");
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenView = (registration) => {
    blurActiveElement();
    setViewData(registration);
    setViewModalOpen(true);
  };

  const handleViewClose = () => {
    setViewModalOpen(false);
    setViewData(null);
  };

  const handleOpenDelete = (registration, event) => {
    event?.stopPropagation?.();
    blurActiveElement();
    setDeleteData(registration);
    setDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
    setDeleteData(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteData) return;
    setDeleteLoading(true);
    try {
      await deletePreCycleRegistration(deleteData.registrarId);
      toast.success("Pre-inscripción eliminada con éxito");
      handleDeleteClose();
      await fetchRegistrations();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Error al eliminar la pre-inscripción");
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    registrations,
    tableLoading,
    fetchRegistrations,
    formModalOpen,
    formEditData,
    formLoading,
    handleOpenCreate,
    handleOpenEdit,
    handleFormClose,
    handleFormSave,
    viewModalOpen,
    viewData,
    handleOpenView,
    handleViewClose,
    deleteModalOpen,
    deleteData,
    deleteLoading,
    handleOpenDelete,
    handleDeleteClose,
    handleDeleteConfirm,
  };
};
