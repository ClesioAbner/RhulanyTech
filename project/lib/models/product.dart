class Product {
  final String id;
  final String name;
  final double price;
  final String image;
  final String description;
  final String category;
  final List<String> specs;
  final bool inStock;
  final double? discount;
  final double rating;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.image,
    required this.description,
    required this.category,
    required this.specs,
    required this.inStock,
    this.discount,
    required this.rating,
  });
}