import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { DocumentCapture } from "../common/DocumentCapture";
import { MERCADO_PAGO_ALIAS } from "../../config/inscriptionFields";

export const InscriptionPaymentStep = ({
  comprobantePago,
  comprobantePagoNombre,
  loading,
  onPaymentChange,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAlias = async () => {
    try {
      await navigator.clipboard.writeText(MERCADO_PAGO_ALIAS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Tarjeta de información de pago */}
      <Paper
        variant="outlined"
        sx={(theme) => ({
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          borderColor: alpha(theme.palette.primary.main, 0.2),
        })}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <PaymentIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Pago de inscripción
          </Typography>
        </Stack>

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          Para completar tu solicitud, debés realizar la transferencia del valor de la inscripción
          a través de Mercado Pago o cualquier banco/billetera virtual con el siguiente alias:
        </Typography>

        {/* Caja interactiva para copiar el alias */}
        <Box
          sx={(theme) => ({
            p: { xs: 1.5, sm: 2 },
            borderRadius: 1.5,
            bgcolor: "background.paper",
            border: "1.5px solid",
            borderColor: "secondary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            boxShadow: `0 2px 8px ${alpha(theme.palette.secondary.main, 0.15)}`,
          })}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
              }}
            >
              Alias de Mercado Pago
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontFamily: "monospace",
                color: "primary.main",
                letterSpacing: "0.03em",
                userSelect: "all",
              }}
            >
              {MERCADO_PAGO_ALIAS}
            </Typography>
          </Box>

          <Button
            variant={copied ? "contained" : "outlined"}
            color={copied ? "success" : "secondary"}
            size="small"
            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            onClick={handleCopyAlias}
            sx={{ minHeight: 38 }}
          >
            {copied ? "¡Alias copiado!" : "Copiar alias"}
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
            <strong>Pasos a seguir:</strong>
            <br />
            1. Abrí Mercado Pago o tu app bancaria y transferí al alias <code>{MERCADO_PAGO_ALIAS}</code>.
            <br />
            2. Guardá o sacale una captura o PDF al comprobante emitido por la aplicación.
            <br />
            3. Adjuntalo a continuación (se admiten imágenes JPG/PNG o documentos PDF).
          </Typography>
        </Box>
      </Paper>

      {/* Componente para subir el comprobante */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Comprobante de pago *
        </Typography>
        <DocumentCapture
          value={comprobantePago}
          fileName={comprobantePagoNombre}
          onChange={(val, name) => onPaymentChange(val, name)}
          disabled={loading}
          label="Adjuntar comprobante de pago *"
          helperText="Podés subir una captura/foto del comprobante o el archivo PDF emitido."
          accept="image/*,application/pdf"
          allowPdf={true}
          aspectRatio="16 / 9"
          icon={ReceiptLongIcon}
        />
      </Box>
    </Box>
  );
};

