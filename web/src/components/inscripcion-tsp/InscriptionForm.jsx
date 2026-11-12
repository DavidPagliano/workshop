import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { InscriptionStepper } from "./InscriptionStepper";
import { InscriptionPhotoStep } from "./InscriptionPhotoStep";
import { InscriptionPersonalStep } from "./InscriptionPersonalStep";
import { InscriptionDniStep } from "./InscriptionDniStep";
import { InscriptionMedicalStep } from "./InscriptionMedicalStep";
import { InscriptionPaymentStep } from "./InscriptionPaymentStep";
import { InscriptionConfirmationStep } from "./InscriptionConfirmationStep";

/**
 * Formulario de inscripción por 6 pasos para TSP:
 * 1. Foto → 2. Datos principales → 3. DNI frente y dorso → 4. Ficha médica → 5. Pago inscripción → 6. Confirmación.
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
  handleDniChange,
  handlePaymentChange,
  prevStep,
  goToStep,
  submitInscription,
}) => {
  const sectionProps = { formData, getValue, errors, loading, onChange: handleChange, onBlur: handleBlur };

  const isNextDisabled =
    loading ||
    (activeStep === 0 && !formData.foto) ||
    (activeStep === 2 && (!formData.dniFrente || !formData.dniDorso)) ||
    (activeStep === 4 && !formData.comprobantePago);

  return (
    <Box component="form" onSubmit={submitInscription} noValidate sx={{ width: "100%" }}>
      <InscriptionStepper activeStep={activeStep} onStepClick={goToStep} disabled={loading} />

      {error && (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          {error}
        </Alert>
      )}

      {/* Paso 1: Foto del inscripto */}
      {activeStep === 0 && (
        <InscriptionPhotoStep foto={formData.foto} loading={loading} onPhotoChange={handlePhotoChange} />
      )}

      {/* Paso 2: Datos principales */}
      {activeStep === 1 && <InscriptionPersonalStep {...sectionProps} />}

      {/* Paso 3: Foto del DNI (Frente y Dorso) */}
      {activeStep === 2 && (
        <InscriptionDniStep
          dniFrente={formData.dniFrente}
          dniDorso={formData.dniDorso}
          loading={loading}
          onDniChange={handleDniChange}
        />
      )}

      {/* Paso 4: Ficha médica */}
      {activeStep === 3 && <InscriptionMedicalStep {...sectionProps} />}

      {/* Paso 5: Pago de inscripción (Mercado Pago y comprobante) */}
      {activeStep === 4 && (
        <InscriptionPaymentStep
          comprobantePago={formData.comprobantePago}
          comprobantePagoNombre={formData.comprobantePagoNombre}
          loading={loading}
          onPaymentChange={handlePaymentChange}
        />
      )}

      {/* Paso 6: Confirmación y mensaje formal institucional */}
      {activeStep === 5 && (
        <InscriptionConfirmationStep formData={formData} career="TSP" />
      )}

      {(activeStep === 1 || activeStep === 3) && (
        <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ color: "text.secondary", mt: 2, mb: 1.5 }}
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
