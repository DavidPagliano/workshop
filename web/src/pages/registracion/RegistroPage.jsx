import React from 'react';
import { Container, Card, CardContent, Typography, Alert, Box } from '@mui/material';
import { useRegistroForm } from '../../hooks/useRegistroForm'; // Importamos la Lógica (Hook)
import { FormularioRegistro } from '../../components/FormularioRegistro'; // Importamos la Vista (Componente)

export default function RegistroPage() {
  // 1. Consumimos la lógica aislada de nuestro Custom Hook
  const { 
    formData, 
    loading, 
    error, 
    success, 
    datosConfirmados, 
    handleChange, 
    handleSubmit 
  } = useRegistroForm();

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Card elevation={4} sx={{ borderRadius: 3, p: 2 }}>
        <CardContent>
          {/* Encabezado */}
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Inscripción al Evento
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Completa tus datos para reservar tu lugar en el Multimedia Day 2026
          </Typography>

          {/* Alertas de Feedback en Pantalla */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              ¡Registro exitoso! Se ha enviado un correo electrónico de confirmación.
            </Alert>
          )}

          {/* 2. Renderizamos el Formulario Visual (solo si no se ha completado con éxito) */}
          {!success && (
            <FormularioRegistro 
              formData={formData} 
              handleChange={handleChange} 
              onSubmit={handleSubmit} 
              loading={loading}
            />
          )}

          {/* 3. Tarjeta de Confirmación de Datos (Se muestra al finalizar con éxito) */}
          {success && datosConfirmados && (
            <Box sx={{ mt: 3, p: 3, bgcolor: '#f0f4c3', borderRadius: 2, borderLeft: '6px solid #8bc34a' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#33691e', mb: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Icono SVG de Éxito */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Resumen de Inscripción Validada
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Nombre completo:</strong> {datosConfirmados.nombre} {datosConfirmados.apellido}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Celular:</strong> {datosConfirmados.celular}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Email registrado:</strong> {datosConfirmados.email}</Typography>
              <Typography variant="body1"><strong>Tema de interés:</strong> {datosConfirmados.temasInteres}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}