import { PrismaClient, OperationType, PropertyType, Currency, PropertyStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos MoyaProp...');

  // 1. Crear o actualizar Administrador Inicial
  const adminEmail = 'admin@moyaprop.com';
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('MoyaProp2025!', 10);
    const admin = await prisma.adminUser.create({
      data: {
        email: adminEmail,
        name: 'Administración Moya',
        passwordHash
      }
    });
    console.log(`✅ Usuario Administrador creado: ${admin.email}`);
  } else {
    console.log(`ℹ️ El administrador ya existe: ${adminEmail}`);
  }

  // 2. Crear un par de propiedades de ejemplo si no hay ninguna
  const propertyCount = await prisma.property.count();
  if (propertyCount === 0) {
    await prisma.property.create({
      data: {
        title: 'Hermosa Casa Moderna con Parque y Piscina',
        description: 'Excelente propiedad distribuida en dos plantas. En planta baja amplio living comedor, cocina integrada con isla, toilette y lavadero. En planta alta 3 dormitorios (uno en suite con vestidor) y baño completo. Galería con parrilla, piscina climatizada y cochera para dos vehículos.',
        operationType: OperationType.VENTA,
        propertyType: PropertyType.CASA,
        price: 245000,
        currency: Currency.USD,
        expenses: 0,
        totalArea: 450,
        coveredArea: 210,
        bedrooms: 3,
        bathrooms: 3,
        garages: 2,
        address: 'Av. Los Álamos 1420',
        city: 'Tigre',
        neighborhood: 'Barrio Privado Las Palmas',
        status: PropertyStatus.ACTIVA,
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
              publicId: 'demo_casa_1',
              order: 0,
              isCover: true
            },
            {
              url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
              publicId: 'demo_casa_2',
              order: 1,
              isCover: false
            },
            {
              url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
              publicId: 'demo_casa_3',
              order: 2,
              isCover: false
            }
          ]
        }
      }
    });

    await prisma.property.create({
      data: {
        title: 'Departamento 2 Ambientes con Balcón Aterrazado',
        description: 'Impecable departamento a estrenar con vista abierta. Living comedor luminoso con salida al balcón aterrazado con parrilla propia. Cocina equipada con bajo mesada y alacena de primera calidad. Dormitorio con placard integral y baño completo.',
        operationType: OperationType.ALQUILER,
        propertyType: PropertyType.DEPARTAMENTO,
        price: 450000,
        currency: Currency.ARS,
        expenses: 45000,
        totalArea: 58,
        coveredArea: 50,
        bedrooms: 1,
        bathrooms: 1,
        garages: 1,
        address: 'Calle del Sol 850',
        city: 'Vicente López',
        neighborhood: 'Olivos',
        status: PropertyStatus.ACTIVA,
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
              publicId: 'demo_depto_1',
              order: 0,
              isCover: true
            },
            {
              url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
              publicId: 'demo_depto_2',
              order: 1,
              isCover: false
            }
          ]
        }
      }
    });

    console.log('✅ Propiedades iniciales de demostración sembradas.');
  }

  console.log('🌱 Seed finalizado correctamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
