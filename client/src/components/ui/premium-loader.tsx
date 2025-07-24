import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PremiumLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function PremiumLoader({ 
  size = "md", 
  text = "Loading...", 
  className = "" 
}: PremiumLoaderProps) {
  const sizeConfig = {
    sm: { icon: "w-6 h-6", text: "text-sm", spacing: "space-y-2" },
    md: { icon: "w-8 h-8", text: "text-base", spacing: "space-y-3" },
    lg: { icon: "w-12 h-12", text: "text-lg", spacing: "space-y-4" },
  };

  const config = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`flex flex-col items-center justify-center ${config.spacing} ${className}`}
    >
      {/* Animated Sparkle Icon */}
      <motion.div
        className="relative"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity },
        }}
      >
        <motion.div
          className={`${config.icon} text-primary`}
          animate={{
            filter: [
              "drop-shadow(0 0 0px rgba(79, 70, 229, 0.5))",
              "drop-shadow(0 0 20px rgba(79, 70, 229, 0.8))",
              "drop-shadow(0 0 0px rgba(79, 70, 229, 0.5))",
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <Sparkles className="w-full h-full" />
        </motion.div>
        
        {/* Orbiting Dots */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/60 rounded-full"
            animate={{
              rotate: 360,
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              rotate: { 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 0.2
              },
              scale: { 
                duration: 1, 
                repeat: Infinity,
                delay: i * 0.3
              }
            }}
            style={{
              originX: 0.5,
              originY: 0.5,
              x: Math.cos((i * 120) * Math.PI / 180) * 25,
              y: Math.sin((i * 120) * Math.PI / 180) * 25,
            }}
          />
        ))}
      </motion.div>

      {/* Loading Text */}
      <motion.p
        className={`${config.text} text-gray-600 dark:text-gray-300 font-medium`}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        {text}
      </motion.p>

      {/* Progress Dots */}
      <div className="flex space-x-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Page-level loader
export function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <PremiumLoader size="lg" text="Loading your experience..." />
        
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}