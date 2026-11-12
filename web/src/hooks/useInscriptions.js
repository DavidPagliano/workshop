import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { inscriptionTSMService } from "../services/inscriptionTSMService";

const blurActiveElement = () => {
  if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

export const useInscriptions = (service = inscriptionTSMService) => {
  const [inscriptions, setInscriptions] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formEditData, setFormEditData] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchInscriptions = useCallback(async () => {
    setTableLoading(true);
    try {
      const data = await service.getInscriptions();
      const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      setInscriptions(list);
    } catch (error) {
      console.error("Error al cargar inscripciones:", error);
      toast.error("Error al cargar las inscripciones");
    } finally {
      setTableLoading(false);
    }
  }, [service]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInscriptions();
  }, [fetchInscriptions]);

  const handleOpenCreate = () => {
    blurActiveElement();
    setFormEditData(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (inscription, event) => {
    event?.stopPropagation?.();
    blurActiveElement();
    setFormEditData(inscription);
    setFormModalOpen(true);
  };

  const handleFormClose = () => {
    setFormModalOpen(false);
    setFormEditData(null);
  };

  const handleFormSave = async (payload) => {
    setFormLoading(true);
    try {
      if (formEditData) {
        await service.updateInscription(formEditData.inscriptionId, payload);
        toast.success("Inscripción actualizada con éxito");
      } else {
        await service.createInscription(payload);
        toast.success("Inscripción registrada con éxito");
      }

      handleFormClose();
      await fetchInscriptions();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Error al procesar la inscripción");
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenView = (inscription) => {
    blurActiveElement();
    setViewData(inscription);
    setViewModalOpen(true);
  };

  const handleViewClose = () => {
    setViewModalOpen(false);
    setViewData(null);
  };

  const handleOpenDelete = (inscription, event) => {
    event?.stopPropagation?.();
    blurActiveElement();
    setDeleteData(inscription);
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
      await service.deleteInscription(deleteData.inscriptionId);
      toast.success("Inscripción eliminada con éxito");
      handleDeleteClose();
      await fetchInscriptions();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Error al eliminar la inscripción");
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    inscriptions,
    tableLoading,
    fetchInscriptions,
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
