import { Alert, Box } from "@mui/material";
import { MEDICAL_SECTIONS } from "../../config/inscriptionFields";
import { InscriptionSection } from "./InscriptionSection";

/**
 * Paso 3: ficha médica (TSP). Los datos personales se toman del paso anterior.
 */
export const InscriptionMedicalStep = (props) => {
  const { getValue } = props;
  const fullName = `${getValue("nombre") || ""} ${getValue("apellido") || ""}`.trim();

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Ficha médica de <strong>{fullName || "el inscripto"}</strong>
        {getValue("dni") ? ` (DNI ${getValue("dni")})` : ""}. Nombre, DNI y datos de
        nacimiento se completan automáticamente con lo cargado en el paso anterior.
      </Alert>

      {MEDICAL_SECTIONS.map((section) => (
        <InscriptionSection key={section.title} section={section} {...props} />
      ))}
    </Box>
  );
};

