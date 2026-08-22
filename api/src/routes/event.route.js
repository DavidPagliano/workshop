const express = require('express');
const router = express.Router();
const { 
    createEventRegistration, 
    getAllEventRegistrations, 
    getEventRegistrationById, 
    updateEventRegistration, 
    deleteEventRegistration,
    markAttendance } = require('../controllers/eventRegistration.controller');
const validateRequest = require('../middlewares/validateRequest');
const { eventSchema } = require('../schemas/registrationSchema');

// Zod valida -> Controlador recibe datos limpios -> Servicio ejecuta lógica -> Base de Datos
router.post('/', validateRequest(eventSchema), createEventRegistration);
router.get('/', getAllEventRegistrations);
router.get('/:id', getEventRegistrationById);
router.put('/:id', updateEventRegistration);
router.delete('/:id', deleteEventRegistration);
router.patch('/:id/registrado', markAttendance);

module.exports = router;