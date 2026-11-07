import { Box } from "@mui/material";
import { PERSONAL_SECTIONS } from "../../config/inscriptionFields";
import { InscriptionSection } from "./InscriptionSection";

/**
 * Paso 2: datos principales del inscripto y contacto de emergencia.
 */
export const InscriptionPersonalStep = (props) => (
  <Box>
    {PERSONAL_SECTIONS.map((section) => (
      <InscriptionSection key={section.title} section={section} {...props} />
    ))}
  </Box>
);

