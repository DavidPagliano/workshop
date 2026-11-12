import { Step, StepButton, StepLabel, Stepper } from "@mui/material";
import { INSCRIPTION_STEPS } from "../../config/inscriptionFields";

/**
 * Indicador de pasos usando los colores de tspTheme.
 * Permite volver a un paso anterior haciendo click.
 */
export const InscriptionStepper = ({ activeStep, onStepClick, disabled }) => (
  <Stepper
    activeStep={activeStep}
    alternativeLabel
    nonLinear
    sx={{
      mb: { xs: 3, sm: 4 },
      "& .MuiStepIcon-root.Mui-active": { color: "secondary.main" },
      "& .MuiStepIcon-root.Mui-completed": { color: "primary.main" },
      "& .MuiStepLabel-label": {
        fontWeight: 600,
        fontSize: { xs: "0.75rem", sm: "0.85rem" },
        mt: 1,
      },
      "& .MuiStepLabel-label.Mui-active": { color: "primary.main", fontWeight: 700 },
      "& .MuiStepLabel-label.Mui-completed": { color: "text.primary" },
    }}
  >
    {INSCRIPTION_STEPS.map((step, index) => (
      <Step key={step.key} completed={index < activeStep}>
        {index < activeStep && !disabled ? (
          <StepButton onClick={() => onStepClick(index)}>
            <StepLabel>{step.label}</StepLabel>
          </StepButton>
        ) : (
          <StepLabel>{step.label}</StepLabel>
        )}
      </Step>
    ))}
  </Stepper>
);

