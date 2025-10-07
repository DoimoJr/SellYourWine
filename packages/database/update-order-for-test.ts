import "dotenv/config";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Aggiornamento ordine per test...');

  // Prima verifica che l'ordine esista
  const existing = await prisma.order.findUnique({
    where: { id: 'cmg5b63pb00016clhx7funxxk' }
  });

  console.log('Ordine trovato:', existing ? 'SI' : 'NO');
  if (!existing) {
    console.log('❌ Ordine non trovato! Cerco altri ordini...');
    const allOrders = await prisma.order.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' }
    });
    console.log('Primi 3 ordini:', JSON.stringify(allOrders.map(o => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      sellerId: o.sellerId,
      buyerId: o.buyerId
    })), null, 2));

    // Non lanciare errore, mostra info
    console.log('\n✅ Ci sono già ordini in PROCESSING! Usa uno di questi.');
  }

  // Aggiorna l'ordine di Giulia Bianchi a Marco Rossi
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
    totalAmount: order.totalAmount
  });

  console.log('\n🎯 Ora puoi testare:');
  console.log(`1. Login come Giulia Bianchi (giulia.bianchi@example.com / password123)`);
  console.log(`2. Vai su http://localhost:3000/dashboard/orders/${order.id}/manage`);
  console.log(`3. Aggiorna lo stato a "SHIPPED"`);
}

main()
  .catch((e) => {
    console.error('❌ Errore:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
