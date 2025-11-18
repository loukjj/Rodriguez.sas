import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestNotifications() {
  try {
    // Get the first user from the database
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No users found in database');
      return;
    }

    console.log('Creating test notifications for user:', user.email);

    // Create some test notifications
    const notifications = [
      {
        userId: user.id,
        title: 'Bienvenido a Rodriguez',
        message: 'Gracias por registrarte en nuestra plataforma. ¡Explora nuestros productos!',
        isRead: false,
      },
      {
        userId: user.id,
        title: 'Nuevo producto disponible',
        message: 'Hemos agregado nuevos productos a nuestro catálogo. ¡Échales un vistazo!',
        isRead: false,
      },
      {
        userId: user.id,
        title: 'Oferta especial',
        message: '20% de descuento en todos los muebles de oficina esta semana.',
        isRead: true,
      }
    ];

    for (const notification of notifications) {
      await prisma.notification.create({
        data: notification
      });
    }

    console.log('Test notifications created successfully!');
  } catch (error) {
    console.error('Error creating test notifications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestNotifications();