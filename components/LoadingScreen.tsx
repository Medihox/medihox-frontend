"use client"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[rgb(51,171,153)] flex items-center justify-center z-50">
      <div className="text-white text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="mb-8"
        >
          <Heart size={100} className="mx-auto" />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h2 className="text-3xl font-bold mb-4">Loading Your Clinic</h2>
          <p className="text-xl">Please wait while we prepare your dashboard</p>
        </motion.div>
        <motion.div
          className="mt-8 w-16 h-16 border-t-4 border-white rounded-full mx-auto"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      </div>
    </div>
  )
}

