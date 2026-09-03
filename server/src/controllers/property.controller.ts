import { Request, Response, NextFunction } from 'express';
import { PropertyService } from '../services/property.service.js';
import { PropertyStatus } from '@prisma/client';

export class PropertyController {
  // Público: Obtener catálogo activo con filtros
  static async getPublicProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PropertyService.getPublicProperties(req.query as any);
      res.status(200).json({
        success: true,
        data: result.properties,
        meta: result.meta
      });
    } catch (error) {
      next(error);
    }
  }

  // Público: Obtener detalle de inmueble
  static async getPropertyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const property = await PropertyService.getPropertyById(id, false);
      res.status(200).json({
        success: true,
        data: property
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Listar todo el inventario
  static async getAdminProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const status = req.query.status as PropertyStatus | undefined;
      const search = req.query.search as string | undefined;

      const result = await PropertyService.getAdminProperties(page, limit, status, search);
      res.status(200).json({
        success: true,
        data: result.properties,
        meta: result.meta
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Obtener inmueble (incluso si está pausado o vendido)
  static async getAdminPropertyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const property = await PropertyService.getPropertyById(id, true);
      res.status(200).json({
        success: true,
        data: property
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Crear inmueble
  static async createProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const property = await PropertyService.createProperty(req.body);
      res.status(201).json({
        success: true,
        message: 'Propiedad creada con éxito',
        data: property
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Actualizar inmueble
  static async updateProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const property = await PropertyService.updateProperty(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Propiedad actualizada con éxito',
        data: property
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Cambio rápido de estado (Activa / Pausada / Vendida / Alquilada)
  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const property = await PropertyService.updateStatus(id, status);
      res.status(200).json({
        success: true,
        message: `Estado actualizado a ${status}`,
        data: property
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Eliminar inmueble
  static async deleteProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await PropertyService.deleteProperty(id);
      res.status(200).json({
        success: true,
        message: 'Propiedad eliminada correctamente'
      });
    } catch (error) {
      next(error);
    }
  }
}
