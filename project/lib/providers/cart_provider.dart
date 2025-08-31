import 'package:flutter/foundation.dart';

class CartItem {
  final String id;
  final String name;
  final double price;
  final String image;
  int quantity;

  CartItem({
    required this.id,
    required this.name,
    required this.price,
    required this.image,
    required this.quantity,
  });
}

class CartProvider extends ChangeNotifier {
  final List<CartItem> _items = [];
  double _total = 0;

  List<CartItem> get items => _items;
  double get total => _total;

  void addToCart(CartItem item) {
    final existingItemIndex = _items.indexWhere((i) => i.id == item.id);
    if (existingItemIndex != -1) {
      _items[existingItemIndex].quantity++;
    } else {
      _items.add(item);
    }
    _calculateTotal();
    notifyListeners();
  }

  void removeFromCart(String id) {
    _items.removeWhere((item) => item.id == id);
    _calculateTotal();
    notifyListeners();
  }

  void updateQuantity(String id, int quantity) {
    final item = _items.firstWhere((item) => item.id == id);
    item.quantity = quantity;
    _calculateTotal();
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    _total = 0;
    notifyListeners();
  }

  void _calculateTotal() {
    _total = _items.fold(0, (sum, item) => sum + (item.price * item.quantity));
  }
}