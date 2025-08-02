
// components/FadeInWrapper.tsx
"use client";

import { motion } from "framer-motion";

interface FadeInWrapperProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function FadeBoxCard({
  children,
  delay = 0,
  direction = "up",
}: FadeInWrapperProps) {
  const getInitial = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 20 };
      case "down":
        return { opacity: 0, y: -20 };
      case "left":
        return { opacity: 0, x: 20 };
      case "right":
        return { opacity: 0, x: -20 };
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      className="bg-card-color rounded-lg shadow-md overflow-hidden hover:shadow-lg"
      initial={getInitial()}
      whileHover={{ scale: 1.02 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        opacity: { duration: 0.6, delay },
        y: { duration: 0.6, delay },
        scale: { duration: 0.20, delay: 0 },
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}
export function FadeBoxCardWithFlex({
  children,
  delay,
  direction = "up",
}: FadeInWrapperProps) {
  const getInitial = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 20 };
      case "down":
        return { opacity: 0, y: -20 };
      case "left":
        return { opacity: 0, x: 20 };
      case "right":
        return { opacity: 0, x: -20 };
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      className="bg-card-color rounded-lg flex shadow-md overflow-hidden hover:shadow-lg"
      initial={getInitial()}
      whileHover={{ scale: 1.02 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        opacity: { duration: 0.7, delay },
        y: { duration: 0.7, delay },
        scale: { duration: 0.20, delay: 0 },
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

export function FadePostCard({
  children,
  delay = 0,
  direction = "up",
}: FadeInWrapperProps) {
  const getInitial = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 20 };
      case "down":
        return { opacity: 0, y: -20 };
      case "left":
        return { opacity: 0, x: 20 };
      case "right":
        return { opacity: 0, x: -20 };
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}
