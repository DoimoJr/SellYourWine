import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password per tutti gli utenti
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Crea Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@winemarket.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'System',
      hashedPassword,
      role: 'ADMIN',
      verified: true,
      profileComplete: true,
      bio: 'Amministratore del marketplace',
    },
  });
  console.log('✅ Admin creato:', admin.email);

  // 2. Crea 3 Utenti/Venditori
  const seller1 = await prisma.user.create({
    data: {
      email: 'mario.rossi@email.com',
      username: 'mariorossi',
      firstName: 'Mario',
      lastName: 'Rossi',
      hashedPassword,
      role: 'USER',
      verified: true,
      profileComplete: true,
      bio: 'Appassionato di vini toscani con una collezione personale di oltre 200 bottiglie.',
      location: 'Firenze, Toscana',
      avatar: 'https://i.pravatar.cc/150?u=mario',
    },
  });

  const seller2 = await prisma.user.create({
    data: {
      email: 'giulia.bianchi@email.com',
      username: 'giuliabianchi',
      firstName: 'Giulia',
      lastName: 'Bianchi',
      hashedPassword,
      role: 'USER',
      verified: true,
      profileComplete: true,
      bio: 'Sommelier professionista specializzata in vini del Piemonte.',
      location: 'Alba, Piemonte',
      avatar: 'https://i.pravatar.cc/150?u=giulia',
    },
  });

  const seller3 = await prisma.user.create({
    data: {
      email: 'luca.verdi@email.com',
      username: 'lucaverdi',
      firstName: 'Luca',
      lastName: 'Verdi',
      hashedPassword,
      role: 'USER',
      verified: true,
      profileComplete: true,
      bio: 'Collezionista di vini pregiati con esperienza ventennale nel settore.',
      location: 'Verona, Veneto',
      avatar: 'https://i.pravatar.cc/150?u=luca',
    },
  });

  console.log('✅ Utenti creati: 3');

  // 3. Crea Vini - alcuni venduti da più venditori
  const wines = [
    {
      title: 'Barolo DOCG Riserva 2015',
      description: 'Un Barolo elegante e strutturato, con note di ciliegia, rosa e liquirizia. Perfetto per carni rosse e formaggi stagionati.',
      price: 89.90,
      annata: 2015,
      region: 'Piemonte',
      country: 'Italia',
      producer: 'Cantina Marchesi di Barolo',
      grapeVariety: 'Nebbiolo',
      alcoholContent: 14.5,
      volume: 750,
      wineType: 'RED',
      condition: 'EXCELLENT',
      quantity: 3,
      images: ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800'],
    },
    {
      title: 'Brunello di Montalcino DOCG 2016',
      description: 'Grande classico toscano, complesso e longevo. Note di frutti rossi maturi, spezie e tabacco.',
      price: 75.50,
      annata: 2016,
      region: 'Toscana',
      country: 'Italia',
      producer: 'Tenuta Biondi-Santi',
      grapeVariety: 'Sangiovese Grosso',
      alcoholContent: 14.0,
      volume: 750,
      wineType: 'RED',
      condition: 'EXCELLENT',
      quantity: 2,
      images: ['https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800'],
    },
    {
      title: 'Amarone della Valpolicella Classico 2017',
      description: 'Vino potente e vellutato, ottenuto da uve appassite. Aromi di prugna, cioccolato e spezie orientali.',
      price: 65.00,
      annata: 2017,
      region: 'Veneto',
      country: 'Italia',
      producer: 'Masi Agricola',
      grapeVariety: 'Corvina, Rondinella, Molinara',
      alcoholContent: 15.5,
      volume: 750,
      wineType: 'RED',
      condition: 'EXCELLENT',
      quantity: 4,
      images: ['https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800'],
    },
    {
      title: 'Gavi di Gavi DOCG 2021',
      description: 'Bianco piemontese fresco e minerale, con note di fiori bianchi e agrumi. Ideale con pesce e frutti di mare.',
      price: 22.90,
      annata: 2021,
      region: 'Piemonte',
      country: 'Italia',
      producer: 'La Scolca',
      grapeVariety: 'Cortese',
      alcoholContent: 12.5,
      volume: 750,
      wineType: 'WHITE',
      condition: 'EXCELLENT',
      quantity: 6,
      images: ['https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800'],
    },
    {
      title: 'Franciacorta Satèn Brut DOCG 2019',
      description: 'Spumante metodo classico cremoso e raffinato, con perlage fine e persistente. Note di pane tostato e frutta bianca.',
      price: 38.00,
      annata: 2019,
      region: 'Lombardia',
      country: 'Italia',
      producer: 'Bellavista',
      grapeVariety: 'Chardonnay',
      alcoholContent: 12.5,
      volume: 750,
      wineType: 'SPARKLING',
      condition: 'EXCELLENT',
      quantity: 5,
      images: ['https://images.unsplash.com/photo-1558346547-4439467febc6?w=800'],
    },
    {
      title: 'Chianti Classico Riserva DOCG 2018',
      description: 'Rosso toscano di carattere con note di ciliegia, viola e spezie. Strutturato ma elegante.',
      price: 28.50,
      annata: 2018,
      region: 'Toscana',
      country: 'Italia',
      producer: 'Castello di Brolio',
      grapeVariety: 'Sangiovese',
      alcoholContent: 13.5,
      volume: 750,
      wineType: 'RED',
      condition: 'VERY_GOOD',
      quantity: 3,
      images: ['https://images.unsplash.com/photo-1474722883778-ab3ea1ab8aa7?w=800'],
    },
    {
      title: 'Prosecco Superiore DOCG Valdobbiadene 2022',
      description: 'Prosecco fresco e fruttato con note di mela verde e fiori bianchi. Perfetto per aperitivi.',
      price: 18.90,
      annata: 2022,
      region: 'Veneto',
      country: 'Italia',
      producer: 'Nino Franco',
      grapeVariety: 'Glera',
      alcoholContent: 11.5,
      volume: 750,
      wineType: 'SPARKLING',
      condition: 'EXCELLENT',
      quantity: 8,
      images: ['https://images.unsplash.com/photo-1519671845924-1fd18db430b8?w=800'],
    },
    {
      title: 'Primitivo di Manduria DOP 2020',
      description: 'Rosso pugliese caldo e avvolgente con note di confettura di prugne, spezie dolci e cioccolato.',
      price: 19.90,
      annata: 2020,
      region: 'Puglia',
      country: 'Italia',
      producer: 'Feudi di San Marzano',
      grapeVariety: 'Primitivo',
      alcoholContent: 14.5,
      volume: 750,
      wineType: 'RED',
      condition: 'EXCELLENT',
      quantity: 4,
      images: ['https://images.unsplash.com/photo-1566995541428-1b6fd8e5e45d?w=800'],
    },
    {
      title: 'Vermentino di Sardegna DOC 2022',
      description: 'Bianco sardo fresco e sapido con note di agrumi e erbe aromatiche. Ottimo con piatti di mare.',
      price: 15.90,
      annata: 2022,
      region: 'Sardegna',
      country: 'Italia',
      producer: 'Sella & Mosca',
      grapeVariety: 'Vermentino',
      alcoholContent: 13.0,
      volume: 750,
      wineType: 'WHITE',
      condition: 'EXCELLENT',
      quantity: 6,
      images: ['https://images.unsplash.com/photo-1596132254116-9a9e2a8f0fe5?w=800'],
    },
    {
      title: 'Aglianico del Vulture DOC 2017',
      description: 'Rosso lucano strutturato e tannico, con note di frutti neri, liquirizia e spezie. Da invecchiamento.',
      price: 32.00,
      annata: 2017,
      region: 'Basilicata',
      country: 'Italia',
      producer: 'Elena Fucci - Titolo',
      grapeVariety: 'Aglianico',
      alcoholContent: 14.0,
      volume: 750,
      wineType: 'RED',
      condition: 'EXCELLENT',
      quantity: 2,
      images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800'],
    },
    {
      title: 'Soave Classico DOC 2021',
      description: 'Bianco veneto delicato con note di fiori bianchi, mandorla e miele. Elegante e versatile.',
      price: 16.50,
      annata: 2021,
      region: 'Veneto',
      country: 'Italia',
      producer: 'Pieropan',
      grapeVariety: 'Garganega',
      alcoholContent: 12.5,
      volume: 750,
      wineType: 'WHITE',
      condition: 'EXCELLENT',
      quantity: 5,
      images: ['https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800'],
    },
    {
      title: 'Nero d\'Avola Sicilia IGT 2020',
      description: 'Rosso siciliano morbido e fruttato con note di ciliegia nera, spezie e note balsamiche.',
      price: 14.90,
      annata: 2020,
      region: 'Sicilia',
      country: 'Italia',
      producer: 'Planeta',
      grapeVariety: 'Nero d\'Avola',
      alcoholContent: 13.5,
      volume: 750,
      wineType: 'RED',
      condition: 'EXCELLENT',
      quantity: 7,
      images: ['https://images.unsplash.com/photo-1574096079513-d8259312b785?w=800'],
    },
    {
      title: 'Moscato d\'Asti DOCG 2022',
      description: 'Dolce piemontese delicato e aromatico, con note di pesca bianca, rosa e salvia. Perfetto per dessert.',
      price: 12.90,
      annata: 2022,
      region: 'Piemonte',
      country: 'Italia',
      producer: 'Michele Chiarlo',
      grapeVariety: 'Moscato Bianco',
      alcoholContent: 5.5,
      volume: 750,
      wineType: 'DESSERT',
      condition: 'EXCELLENT',
      quantity: 10,
      images: ['https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=800'],
    },
    {
      title: 'Montepulciano d\'Abruzzo DOC 2019',
      description: 'Rosso abruzzese corposo e morbido con note di ciliegia matura, spezie e un tocco di vaniglia.',
      price: 11.90,
      annata: 2019,
      region: 'Abruzzo',
      country: 'Italia',
      producer: 'Masciarelli',
      grapeVariety: 'Montepulciano',
      alcoholContent: 13.5,
      volume: 750,
      wineType: 'RED',
      condition: 'VERY_GOOD',
      quantity: 6,
      images: ['https://images.unsplash.com/photo-1566566371-4a0e6c7e0a7f?w=800'],
    },
    {
      title: 'Greco di Tufo DOCG 2021',
      description: 'Bianco campano strutturato e minerale con note di agrumi, pera e mandorla. Ottima persistenza.',
      price: 21.50,
      annata: 2021,
      region: 'Campania',
      country: 'Italia',
      producer: 'Feudi di San Gregorio',
      grapeVariety: 'Greco',
      alcoholContent: 13.0,
      volume: 750,
      wineType: 'WHITE',
      condition: 'EXCELLENT',
      quantity: 4,
      images: ['https://images.unsplash.com/photo-1606312617954-c85d2e13b129?w=800'],
    },
  ];

  let wineCount = 0;

  // Mario Rossi - 5 vini
  for (let i = 0; i < 5; i++) {
    await prisma.wine.create({ data: { ...wines[i], sellerId: seller1.id } });
    wineCount++;
  }

  // Giulia Bianchi - 5 vini
  for (let i = 5; i < 10; i++) {
    await prisma.wine.create({ data: { ...wines[i], sellerId: seller2.id } });
    wineCount++;
  }

  // Luca Verdi - 5 vini
  for (let i = 10; i < 15; i++) {
    await prisma.wine.create({ data: { ...wines[i], sellerId: seller3.id } });
    wineCount++;
  }

  // Vini duplicati - stessi vini venduti da venditori diversi
  await prisma.wine.create({ data: { ...wines[0], sellerId: seller2.id, quantity: 2, price: 92.00 } });
  wineCount++;

  await prisma.wine.create({ data: { ...wines[1], sellerId: seller3.id, quantity: 1, price: 78.90 } });
  wineCount++;

  await prisma.wine.create({ data: { ...wines[2], sellerId: seller2.id, quantity: 3, price: 67.50 } });
  wineCount++;

  console.log(`✅ Vini creati: ${wineCount}`);

  console.log('\n🎉 Seed completato!');
  console.log('\n📊 Credenziali:');
  console.log('Admin: admin@winemarket.com / password123');
  console.log('Mario: mario.rossi@email.com / password123');
  console.log('Giulia: giulia.bianchi@email.com / password123');
  console.log('Luca: luca.verdi@email.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Errore:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
