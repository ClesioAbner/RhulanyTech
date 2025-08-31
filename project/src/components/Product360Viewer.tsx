import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Product360ViewerProps {
  productId: string;
  productName: string;
  images: string[];
  onClose: () => void;
}

const Product360Viewer: React.FC<Product360ViewerProps> = ({ 
 
  productName, 
  images, 
  onClose 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-rotate functionality
  useEffect(() => {
    if (isRotating) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isRotating, images.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    if (zoom > 1) {
      // Pan when zoomed
      setPosition(prev => ({
        x: prev.x + deltaX * 0.5,
        y: prev.y + deltaY * 0.5
      }));
    } else {
      // Rotate when not zoomed
      const rotationY = (deltaX / 5) % 360;
      const rotationX = Math.max(-45, Math.min(45, deltaY / 5));
      
      setRotation({ x: rotationX, y: rotationY });
      
      // Update image index based on horizontal drag
      const imageIndex = Math.floor((Math.abs(deltaX) / 20) % images.length);
      setCurrentImageIndex(imageIndex);
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      if (direction === 'in') {
        return Math.min(prev + 0.5, 3);
      } else {
        return Math.max(prev - 0.5, 0.5);
      }
    });
  };

  const resetView = () => {
    setZoom(1);
    setRotation({ x: 0, y: 0 });
    setPosition({ x: 0, y: 0 });
    setCurrentImageIndex(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        className="relative bg-white rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{productName}</h2>
            <p className="text-gray-600">Visualização 360° • {images.length} ângulos</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl p-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            ✕
          </button>
        </div>

        {/* 360° Viewer */}
        <div 
          ref={containerRef}
          className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing mb-6"
          style={{ height: '500px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={`${productName} - Ângulo ${currentImageIndex + 1}`}
            className="w-full h-full object-contain"
            style={{
              transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translate(${position.x}px, ${position.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={() => handleZoom('in')}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all"
              title="Zoom In"
            >
              <span className="text-xl">🔍+</span>
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all"
              title="Zoom Out"
            >
              <span className="text-xl">🔍-</span>
            </button>
            <button
              onClick={resetView}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all"
              title="Reset View"
            >
              <span className="text-xl">🔄</span>
            </button>
          </div>

          {/* Info Overlay */}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">
              {currentImageIndex + 1}/{images.length} • Zoom: {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all"
          >
            <span className="text-xl">←</span>
          </button>
          <button
            onClick={() => setCurrentImageIndex(prev => (prev + 1) % images.length)}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all"
          >
            <span className="text-xl">→</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              isRotating 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isRotating ? '⏸️ Parar Rotação' : '▶️ Auto Rotação'}
          </button>
          
          <button
            onClick={resetView}
            className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-semibold"
          >
            🔄 Reset View
          </button>

          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3">
            <span className="text-sm font-medium">Velocidade:</span>
            <input
              type="range"
              min="50"
              max="500"
              defaultValue="150"
              className="w-20"
              onChange={() => {
                // Update rotation speed
              }}
            />
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                currentImageIndex === index 
                  ? 'border-blue-500 shadow-lg scale-110' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
          <p className="mb-2">
            <strong>🖱️ Controles:</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <p>• Arraste para girar o produto</p>
            <p>• Use os botões + / - para zoom</p>
            <p>• Clique nas miniaturas para navegar</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Product360Viewer;
