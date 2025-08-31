import 'package:go_router/go_router.dart';
import 'package:rhulany_tech/screens/home_screen.dart';
import 'package:rhulany_tech/screens/products_screen.dart';
import 'package:rhulany_tech/screens/product_detail_screen.dart';
//import 'package:rhulany_tech/screens/cart_screen.dart';
// Ensure that CartScreen is defined in cart_screen.dart and is exported as a class.
//import 'package:rhulany_tech/screens/checkout_screen.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/products',
      builder: (context, state) => const ProductsScreen(),
    ),
    GoRoute(
      path: '/products/:id',
      builder: (context, state) => ProductDetailScreen(
        productId: state.pathParameters['id']!,
      ),
    ),
    GoRoute(
      path: '/cart',
      //builder: (context, state) => const CartScreen(),
    ),
    GoRoute(
      path: '/checkout',
      //builder: (context, state) => const CheckoutScreen(),
    ),
  ],
);
