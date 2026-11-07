import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { InscriptionStepper } from "./InscriptionStepper";
import { InscriptionPhotoStep } from "./InscriptionPhotoStep";
import { InscriptionPersonalStep } from "./InscriptionPersonalStep";
import { InscriptionMedicalStep } from "./InscriptionMedicalStep";
import { InscriptionReviewStep } from "./InscriptionReviewStep";

/**
 * Formulario de inscripción por pasos:
 * 1. Foto → 2. Datos principales → 3. Ficha médica → 4. Revisión.
 * Recibe todo el estado desde useInscriptionForm y hereda institutionalTheme.
 */
export const InscriptionForm = ({
  formData,
  activeStep,
  isLastStep,
  errors,
  loading,
  error,
  getValue,
  handleChange,
  handleBlur,
  handlePhotoChange,
  prevStep,
  goToStep,
  submitInscription,
}) => {
  const sectionProps = { formData, getValue, errors, loading, onChange: handleChange, onBlur: handleBlur };
  const isNextDisabled = loading || (activeStep === 0 && !formData.foto);

  return (
    <Box component="form" onSubmit={submitInscription} noValidate sx={{ width: "100%" }}>
      <InscriptionStepper activeStep={activeStep} onStepClick={goToStep} disabled={loading} />

      {error && (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          {error}
        </Alert>
      )}

      {activeStep === 0 && (
        <InscriptionPhotoStep foto={formData.foto} loading={loading} onPhotoChange={handlePhotoChange} />
      )}
      {activeStep === 1 && <InscriptionPersonalStep {...sectionProps} />}
      {activeStep === 2 && <InscriptionMedicalStep {...sectionProps} />}
      {activeStep === 3 && (
        <InscriptionReviewStep formData={formData} getValue={getValue} onEditStep={goToStep} />
      )}

      {(activeStep === 1 || activeStep === 2) && (
        <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ color: "text.secondary", mb: 1.5 }}
        >
          Los campos marcados con * son obligatorios.
        </Typography>
      )}

      <Stack direction="row" spacing={2} sx={{ mt: { xs: 2.5, sm: 3 } }}>
        {activeStep > 0 && (
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={prevStep}
            disabled={loading}
            sx={{ flex: 1, minHeight: 48 }}
          >
            ← Atrás
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isNextDisabled}
          sx={{ flex: 2, minHeight: 48 }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : isLastStep ? (
            "Confirmar inscripción"
          ) : (
            "Siguiente →"
          )}
        </Button>
      </Stack>
    </Box>
  );
};
