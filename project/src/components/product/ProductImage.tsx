import type { ImgHTMLAttributes } from 'react';
import { isCutout } from '../../lib/images';

interface ProductImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  /** Inset around a cut-out, as a Tailwind padding class; photos always fill the frame. */
  inset?: string;
}

/*
 * A product picture inside a positioned frame. Studio cut-outs are shown whole and centred with a
 * soft shadow, the way brand stores show their products; regular photos fill the frame.
 */
const ProductImage = ({ src, alt = '', inset = 'p-[11%]', className = '', ...rest }: ProductImageProps) =>
  isCutout(src) ? (
    <span className={`absolute inset-0 block ${inset}`}>
      <img src={src} alt={alt} draggable={false} className={`stage-shadow h-full w-full object-contain ${className}`} {...rest} />
    </span>
  ) : (
    <img src={src} alt={alt} draggable={false} className={`absolute inset-0 h-full w-full object-cover ${className}`} {...rest} />
  );

export default ProductImage;
