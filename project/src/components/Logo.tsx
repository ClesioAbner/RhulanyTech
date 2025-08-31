import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  animated?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'default', 
  animated = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          primary: 'text-white',
          secondary: 'text-white/80',
          gradient: 'from-white to-white/80'
        };
      case 'dark':
        return {
          primary: 'text-gray-900',
          secondary: 'text-gray-700',
          gradient: 'from-gray-900 to-gray-700'
        };
      default:
        return {
          primary: 'text-blue-600',
          secondary: 'text-purple-600',
          gradient: 'from-blue-600 via-purple-600 to-cyan-500'
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <motion.div 
        className={`${sizeClasses[size]} relative flex items-center justify-center`}
        animate={animated ? {
          rotateY: [0, 360],
          scale: [1, 1.05, 1]
        } : {}}
        transition={{
          rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Outer Ring */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.gradient} opacity-20`}
          animate={animated ? {
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        {/* Inner Hexagon */}
        <motion.div
          className={`absolute inset-1 bg-gradient-to-br ${colors.gradient} rounded-lg transform rotate-45`}
          animate={animated ? {
            rotate: [45, 405],
            scale: [1, 0.9, 1]
          } : { rotate: 45 }}
          transition={{
            rotate: { duration: 6, repeat: Infinity, ease: "linear" },
            scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        {/* Center Circle */}
        <motion.div
          className={`relative z-10 w-3/4 h-3/4 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center shadow-lg`}
          animate={animated ? {
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 0 rgba(59, 130, 246, 0)',
              '0 0 20px rgba(59, 130, 246, 0.5)',
              '0 0 0 rgba(59, 130, 246, 0)'
            ]
          } : {}}
          transition={{
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* RT Letters */}
          <motion.span 
            className={`font-bold text-white ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-2xl'}`}
            animate={animated ? {
              scale: [1, 1.1, 1]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            RT
          </motion.span>
        </motion.div>

        {/* Floating Particles */}
        {animated && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 bg-gradient-to-r ${colors.gradient} rounded-full`}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-10, -20, -10],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <motion.h1 
          className={`font-bold ${textSizes[size]} bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent leading-tight`}
          animate={animated ? {
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          } : {}}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ backgroundSize: '200% 200%' }}
        >
          Rhulany Tech
        </motion.h1>
        {size !== 'sm' && (
          <motion.p 
            className={`${colors.secondary} font-medium ${size === 'md' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-base'} leading-tight`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Gaming & Technology
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Logo;