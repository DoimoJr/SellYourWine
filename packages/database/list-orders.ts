import "dotenv/config";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📋 Listing all non-PENDING orders...\n');

  const orders = await prisma.order.findMany({
    where: {},
    include: {
      seller: { select: { firstName: true, lastName: true, email: true } },
      buyer: { select: { firstName: true, lastName: true, email: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  console.log(`Found ${orders.length} orders:\n`);

  orders.forEach((order, index) => {
    console.log(`${index + 1}. Order #${order.orderNumber}`);
    console.log(`   ID: ${order.id}`);
    console.log(`   Status: ${order.status}`);
    console.log(`   Payment Status: ${order.paymentStatus}`);
    console.log(`   Seller: ${order.seller.firstName} ${order.seller.lastName} (${order.seller.email})`);
    console.log(`   Buyer: ${order.buyer.firstName} ${order.buyer.lastName} (${order.buyer.email})`);
    console.log(`   Total: €${order.totalAmount}`);
    console.log('');
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
