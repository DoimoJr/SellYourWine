import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding…');

  // Users
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: { email: 'buyer@example.com', role: 'buyer' },
  });

  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: { email: 'seller@example.com', role: 'seller' },
  });

  // Seller profile
  const seller = await prisma.seller.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: { userId: sellerUser.id, displayName: 'Cantina Demo' },
  });

  // Buyer addresses (shipping + billing)
  const shipping = await prisma.address.upsert({
    where: { id: (await (async () => null)()) as any }, // trick: force create below
    update: {},
    create: {
      userId: buyer.id,
      fullName: 'Mario Rossi',
      line1: 'Via del Vino 10',
      city: 'Firenze',
      postalCode: '50100',
      country: 'IT',
      phone: '+39 333 0000000',
      isDefaultShipping: true,
      isDefaultBilling: true,
    },
  });

  // Category
  const category = await prisma.category.upsert({
    where: { slug: 'rosso' },
    update: {},
    create: { name: 'Rosso', slug: 'rosso' },
  });

  // Products + inventory + images
  const chianti = await prisma.product.create({
    data: {
      sellerId: seller.id,
      categoryId: category.id,
      name: 'Chianti Classico DOCG',
      vintage: 2020,
      region: 'Toscana',
      priceCents: 1599,
      currency: 'EUR',
      inventory: { create: { sku: 'CHIANTI-2020-STD', quantity: 30 } },
      images: { create: [{ url: 'https://picsum.photos/seed/chianti/600/800', position: 1 }] },
    },
  });

  const barolo = await prisma.product.create({
    data: {
      sellerId: seller.id,
      categoryId: category.id,
      name: 'Barolo DOCG',
      vintage: 2018,
      region: 'Piemonte',
      priceCents: 3999,
      currency: 'EUR',
      inventory: { create: { sku: 'BAROLO-2018-STD', quantity: 15 } },
      images: { create: [{ url: 'https://picsum.photos/seed/barolo/600/800', position: 1 }] },
    },
  });

  console.log('✅ Seed completato.\n');
  console.log('IDs utili per testare POST /orders su Swagger:');
  console.log({ 
    buyerId: buyer.id, 
    shippingAddressId: shipping.id, 
    products: [
      { name: chianti.name, productId: chianti.id, priceCents: chianti.priceCents },
      { name: barolo.name,  productId: barolo.id,  priceCents: barolo.priceCents  }
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });