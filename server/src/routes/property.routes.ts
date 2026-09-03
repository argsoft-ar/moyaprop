import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validateBody, validateQuery } from '../middlewares/validate.middleware.js';
import {
  createPropertySchema,
  updatePropertySchema,
  updatePropertyStatusSchema,
  propertyFilterSchema
} from '../types/property.types.js';

const router = Router();

// ==========================================
// Rutas Públicas (Clientes)
// ==========================================
// Catálogo público con buscador y filtros
router.get('/', validateQuery(propertyFilterSchema), PropertyController.getPublicProperties);

// Detalle público de una propiedad
router.get('/:id', PropertyController.getPropertyById);

// ==========================================
// Rutas Privadas (Panel de Administración)
// ==========================================
// Listado completo de inventario (activas, pausadas, vendidas)
router.get('/admin/all', authenticateToken as any, PropertyController.getAdminProperties);

// Detalle de inmueble para edición en el panel
router.get('/admin/:id', authenticateToken as any, PropertyController.getAdminPropertyById);

// Crear nueva propiedad
router.post('/', authenticateToken as any, validateBody(createPropertySchema), PropertyController.createProperty);

// Modificar propiedad completa
router.put('/:id', authenticateToken as any, validateBody(updatePropertySchema), PropertyController.updateProperty);

// Cambio rápido de estado en 1 clic (Activa, Pausada, etc.)
router.patch('/:id/status', authenticateToken as any, validateBody(updatePropertyStatusSchema), PropertyController.updateStatus);

// Eliminar propiedad
router.delete('/:id', authenticateToken as any, PropertyController.deleteProperty);

export default router;
