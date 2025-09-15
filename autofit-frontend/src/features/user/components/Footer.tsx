import React from 'react'
import { Facebook,Twitter,Instagram,Linkedin } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '@/assets/common/af_logo.png'

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer id="support" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
                <img src={Logo} alt="" className='w-32' />
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your trusted companion for safe and reliable travels.
                Professional roadside assistance available 24/7.
              </p>
              <div className="flex space-x-4">
                {[
                  { Icon: Facebook, href: "#" },
                  { Icon: Twitter, href: "#" },
                  { Icon: Instagram, href: "#" },
                  { Icon: Linkedin, href: "#" },
                ].map(({ Icon, href }, index) => (
                  <motion.a
                    key={index}
                    href={href}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.1, y: -2 }}
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 md:col-span-1 lg:col-span-3">
              {[
                {
                  title: "Services",
                  links: [
                    "24/7 Assistance",
                    "Video Support",
                    "Pre-Trip Checkup",
                    "Real-time Tracking",
                  ],
                },
                {
                  title: "Company",
                  links: ["About Us", "Careers", "Press", "Blog"],
                },
                {
                  title: "Support",
                  links: ["Help Center", "Contact", "Safety", "Community"],
                },
               
              ].map((section, index) => (
                <div key={index}>
                  <h4 className="font-semibold mb-4 text-lg">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; 2024 AutoFit. All rights reserved. Built with Love for
                safer travels.
              </p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
               
              </div>
            </div>
          </div>
        </div>
      </footer>

    </>
  )
}

export default Footer

