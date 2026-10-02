import { useRef, type PointerEvent, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import toast from 'react-hot-toast';
import type { Product } from '../../data/products';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice } from '../../lib/format';

const MAX_TILT = 9;
const spring = { stiffness: 220, damping: 22, mass: 0.6 };

interface ProductCardProps {
  product: Product;
  /** Desktop only: leaves the image area empty so a 3D model rendered elsewhere can sit in it. */
  mediaSlotRef?: RefObject<HTMLDivElement>;
}

const ProductCard = ({ product, mediaSlotRef }: ProductCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  // Pointer position normalised to -0.5…0.5; springs make the tilt feel physical rather than glued to the cursor.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), spring);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), spring);
  const imageX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-10, 10]), spring);
  const imageY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-10, 10]), spring);
  const glareX = useTransform(pointerX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(pointerY, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28), transparent 55%)`;

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !cardRef.current || mediaSlotRef) return;
    const rect = cardRef.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      brand: product.brand,
      model: product.model,
      maxQuantity: product.stockQuantity,
    });
    toast(`${product.name} adicionado ao carrinho`);
  };

  return (
    <div className="group [perspective:1000px]">
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative aspect-[4/5] rounded-md bg-mist shadow-[0_1px_0_rgba(12,12,13,0.04)] transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-30px_rgba(12,12,13,0.45)]"
      >
        <Link to={`/products/${product.id}`} className="absolute inset-0 overflow-hidden rounded-md" tabIndex={-1} aria-hidden="true">
          <motion.img
            src={product.images[0]}
            alt=""
            loading="lazy"
            style={{ x: imageX, y: imageY, scale: 1.08 }}
            className={`h-full w-full object-cover ${mediaSlotRef ? 'lg:hidden' : ''}`}
          />
          {mediaSlotRef && (
            <div
              ref={mediaSlotRef}
              className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_at_50%_85%,rgba(12,12,13,0.12),transparent_55%)] lg:block"
            />
          )}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: glare }}
          />
        </Link>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="absolute inset-x-3 bottom-3 h-11 rounded-full bg-paper/95 text-sm font-medium text-ink backdrop-blur transition-all duration-500 ease-out-expo hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:text-ink/40 lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100"
        >
          {product.inStock ? 'Adicionar ao carrinho' : 'Esgotado'}
        </button>
      </motion.div>

      <Link to={`/products/${product.id}`} className="mt-5 block">
        <p className="text-xs uppercase tracking-[0.14em] text-ink/45">{product.brand}</p>
        <h3 className="mt-1.5 text-[15px] font-medium leading-snug">
          <span className="link-underline">{product.name}</span>
        </h3>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2 text-sm tabular-nums">
          <span>{formatPrice(product.price)}</span>
          {product.originalPrice && <span className="text-ink/40 line-through">{formatPrice(product.originalPrice)}</span>}
        </p>
      </Link>
    </div>
  );
};

export default ProductCard;
