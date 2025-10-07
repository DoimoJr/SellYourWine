import "dotenv/config";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Aggiornamento ordine a PROCESSING...');

  const order = await prisma.order.update({
    where: { id: 'cmg5b63pb00016clhx7funxxk' },
    data: {
      status: 'PROCESSING',
      paymentStatus: 'COMPLETED',
      paymentId: 'TEST_PAYMENT_' + Date.now(),
      paymentProvider: 'PAYPAL'
    },
    include: {
      seller: { select: { firstName: true, lastName: true, email: true } },
      buyer: { select: { firstName: true, lastName: true, email: true } }
    }
  });

  console.log('✅ Ordine aggiornato con successo!');
  console.log({
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    seller: `${order.seller.firstName} ${order.seller.lastName} (${order.seller.email})`,
    buyer: `${order.buyer.firstName} ${order.buyer.lastName} (${order.buyer.email})`,
  });
}

main()
  .catch((e) => {
    console.error('❌ Errore:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
