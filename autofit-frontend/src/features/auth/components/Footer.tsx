import { User, Shield, Wrench, Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const portals = [
    { title: "User Portal", icon: User, href: "/auth/user/login", desc: "Customer dashboard" },
    { title: "Mechanic Portal", icon: Wrench, href: "/auth/mechanic/login", desc: "Service management" },
    { title: "Admin Portal", icon: Shield, href: "/auth/admin/login", desc: "System control" },
  ]

  const companyInfo = [
    { icon: Phone, label: "24/7 Emergency", value: "(555) 123-4567" },
    { icon: Mail, label: "Support", value: "support@roadease.com" },
    { icon: MapPin, label: "Headquarters", value: "San Francisco, CA" },
  ]

  const quickLinks = ["About Us", "Services", "Careers", "Help Center", "Privacy Policy", "Terms of Service"]

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">RoadEase</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Professional roadside assistance with certified mechanics available 24/7. Your trusted partner for safe
                and reliable travels.
              </p>
            </div>

            <div className="space-y-3">
              {companyInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                    <info.icon size={16} className="text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">{info.label}</div>
                    <div className="text-sm text-slate-300">{info.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portal Access */}
         <div className="space-y-6">
          <h4 className="text-lg font-semibold text-white">Access Portals</h4>
          <div className="space-y-3">
            {portals.map((portal, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={portal.href}
                  className="group flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 group-hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                      <portal.icon size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{portal.title}</div>
                      <div className="text-xs text-slate-500">{portal.desc}</div>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

          {/* Quick Links & Legal */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm text-slate-400 hover:text-white transition-colors py-1"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="pt-4">
              <h5 className="text-sm font-medium text-white mb-3">Follow Us</h5>
              <div className="flex gap-3">
                {["Twitter", "LinkedIn", "GitHub"].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-9 h-9 bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all text-xs font-medium"
                  >
                    {social.slice(0, 2)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">
              © {currentYear} RoadEase. All rights reserved. Built with precision for safer journeys.
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <span>Powered by</span>
              <span className="text-slate-400 font-medium">RoadEase Technology</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
