import { Prisma, PropertyStatus } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { CreatePropertyDto, UpdatePropertyDto, PropertyFilterDto } from '../types/property.types.js';

export class PropertyService {
  // Obtener propiedades públicas (Solo ACTIVA con filtros)
  static async getPublicProperties(filters: PropertyFilterDto) {
    const {
      operationType,
      propertyType,
      city,
      minPrice,
      maxPrice,
      currency,
      bedrooms,
      featured,
      search,
      page = 1,
      limit = 12
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.PropertyWhereInput = {
      status: PropertyStatus.ACTIVA
    };

    if (operationType) where.operationType = operationType;
    if (propertyType) where.propertyType = propertyType;
    if (currency) where.currency = currency;
    if (bedrooms !== undefined) where.bedrooms = { gte: bedrooms };
    if (featured !== undefined) where.featured = featured;

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [total, properties] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        include: {
          images: {
            orderBy: [{ isCover: 'desc' }, { order: 'asc' }]
          }
        }
      })
    ]);

    return {
      properties,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Obtener una propiedad por ID
  static async getPropertyById(id: string, includeAllStatus: boolean = false) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: [{ isCover: 'desc' }, { order: 'asc' }]
        }
      }
    });

    if (!property) {
      const error: any = new Error('Propiedad no encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (!includeAllStatus && property.status !== PropertyStatus.ACTIVA) {
      const error: any = new Error('Esta publicación ya no se encuentra disponible');
      error.statusCode = 404;
      throw error;
    }

    return property;
  }

  // Listar todas las propiedades para el panel de administración
  static async getAdminProperties(page: number = 1, limit: number = 20, status?: PropertyStatus, search?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.PropertyWhereInput = {};

    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [total, properties] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          images: {
            orderBy: [{ isCover: 'desc' }, { order: 'asc' }]
          }
        }
      })
    ]);

    return {
      properties,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Crear nueva propiedad
  static async createProperty(data: CreatePropertyDto) {
    const { images, ...propertyData } = data;

    return await prisma.property.create({
      data: {
        ...propertyData,
        images: {
          create: images.map((img, index) => ({
            url: img.url,
            publicId: img.publicId,
            order: img.order ?? index,
            isCover: img.isCover ?? index === 0
          }))
        }
      },
      include: {
        images: {
          orderBy: [{ isCover: 'desc' }, { order: 'asc' }]
        }
      }
    });
  }

  // Actualizar propiedad existente
  static async updateProperty(id: string, data: UpdatePropertyDto) {
    const { images, ...propertyData } = data;

    // Verificar si existe
    await this.getPropertyById(id, true);

    return await prisma.$transaction(async (tx) => {
      // Si se proporcionaron imágenes para actualizar
      if (images !== undefined) {
        await tx.propertyImage.deleteMany({ where: { propertyId: id } });
        if (images.length > 0) {
          await tx.propertyImage.createMany({
            data: images.map((img, index) => ({
              propertyId: id,
              url: img.url,
              publicId: img.publicId,
              order: img.order ?? index,
              isCover: img.isCover ?? index === 0
            }))
          });
        }
      }

      return await tx.property.update({
        where: { id },
        data: propertyData,
        include: {
          images: {
            orderBy: [{ isCover: 'desc' }, { order: 'asc' }]
          }
        }
      });
    });
  }

  // Cambio rápido de estado (Activa, Pausada, Vendida, Alquilada)
  static async updateStatus(id: string, status: PropertyStatus) {
    await this.getPropertyById(id, true);

    return await prisma.property.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true
      }
    });
  }

  // Eliminar propiedad
  static async deleteProperty(id: string) {
    await this.getPropertyById(id, true);

    return await prisma.property.delete({
      where: { id }
    });
  }
}
