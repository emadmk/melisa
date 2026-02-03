'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonial = {
  quote: 'The new TETRA system from Motorola Solutions meets our high demands for 24/7 service.',
  author: 'Ivan Perita',
  position: 'Director of the Power System Control Center',
}

export default function CustomersSection() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Quote Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Quote className="w-8 h-8 text-primary" />
          </div>

          {/* Quote Text */}
          <blockquote className="text-xl lg:text-2xl text-gray-700 font-medium mb-8 leading-relaxed">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>

          {/* Author */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-1 h-12 bg-primary rounded-full" />
            <div className="text-left">
              <p className="font-bold text-dark">{testimonial.author}</p>
              <p className="text-gray-500 text-sm">{testimonial.position}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
