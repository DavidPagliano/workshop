export const CHART_COLORS = {
  presente: "#00B4FF",
  ausente: "#D500BA",
  temas: ["#00B4FF", "#D500BA", "#8C30F5", "#52cbff", "#F536DD"],
  secundario: ["#00B4FF", "#D500BA", "#8C30F5"],
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return { fecha: "—", hora: "—" };
  const date = new Date(dateStr);
  return {
    fecha: date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }),
    hora: date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
  };
};