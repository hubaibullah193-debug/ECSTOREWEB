import { getDb } from '@/lib/db';
import { products } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';

const seedProducts = [
  {
    name: 'Glow Serum',
    description: 'Premium illuminating serum for radiant skin',
    price: '2500',
    category: 'Serums',
    stock: 50,
    sku: 'GLOW-SERUM-001',
    isActive: true,
  },
  {
    name: 'Hydration Cream',
    description: 'Deep moisturizing cream for all skin types',
    price: '1800',
    category: 'Creams',
    stock: 75,
    sku: 'HYD-CREAM-001',
    isActive: true,
  },
  {
    name: 'Cleansing Gel',
    description: 'Gentle gel cleanser with natural extracts',
    price: '1200',
    category: 'Cleansers',
    stock: 100,
    sku: 'CLEAN-GEL-001',
    isActive: true,
  },
  {
    name: 'Face Mask',
    description: 'Weekly purifying face mask',
    price: '1500',
    category: 'Masks',
    stock: 60,
    sku: 'FACE-MASK-001',
    isActive: true,
  },
  {
    name: 'Eye Cream',
    description: 'Under-eye brightening cream',
    price: '2000',
    category: 'Eye Care',
    stock: 40,
    sku: 'EYE-CREAM-001',
    isActive: true,
  },
  {
    name: 'Sunscreen SPF 50',
    description: 'Water-resistant broad spectrum sunscreen',
    price: '1600',
    category: 'Sun Care',
    stock: 80,
    sku: 'SUN-SPF50-001',
    isActive: true,
  },
];

export async function seed() {
  try {
    const db = getDb();

    console.log('🌱 Seeding products...');

    for (const product of seedProducts) {
      await db.insert(products).values({
        id: uuidv4(),
        ...product,
      });
    }

    console.log('✅ Seeded', seedProducts.length, 'products');
  } catch (error) {
    console.error('❌ Seed failed:', error);
  }
}
