import 'package:rhulany_tech/models/product.dart';

final products = [
  Product(
    id: '1',
    name: 'PC Gaming Pro RTX 4070',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b',
    description: 'PC Gaming de última geração com RTX 4070 para gaming em 4K',
    category: 'computadores',
    specs: [
      'Intel Core i7 13700K',
      'NVIDIA RTX 4070 12GB',
      '32GB RAM DDR5',
      'SSD NVMe 2TB',
      'Fonte 850W Gold'
    ],
    inStock: true,
    rating: 4.8,
  ),
  // Add more products from the original data...
];