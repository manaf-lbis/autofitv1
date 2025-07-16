"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Car, Video, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface SearchResult {
  id: string
  title: string
  category: string
  description: string
  href: string
  icon: any
  iconColor: string
  iconBg: string
}

const spellCorrections: Record<string, string[]> = {
  tyre: ["tire"],
  tyres: ["tires"],
  "tire repair": ["tyre repair", "tire fix", "tyre fix"],

  batery: ["battery"],
  baterry: ["battery"],
  battry: ["battery"],
  "jump start": ["jumpstart", "boost", "battery boost"],

  break: ["brake"],
  breaks: ["brakes"],
  brakes: ["break", "breaks"],

  engin: ["engine"],
  engien: ["engine"],
  motor: ["engine"],
  overheating: ["over heating", "over-heating"],

  electical: ["electrical"],
  eletrical: ["electrical"],
  wiring: ["electrical", "electric"],

  lockout: ["lock out", "locked out"],
  "locked out": ["lockout", "lock out"],

  tow: ["towing"],
  towing: ["tow", "transport"],

  inspection: ["check", "checkup", "service"],
  checkup: ["inspection", "check", "service"],

  video: ["live", "remote", "virtual"],
  consultation: ["consult", "advice", "help"],
  diy: ["do it yourself", "self repair"],
  "do it yourself": ["diy", "self repair"],

  maintainance: ["maintenance"],
  maintenence: ["maintenance"],
  service: ["maintenance", "servicing"],


  comprehensive: ["complete", "full", "thorough"],
  complete: ["comprehensive", "full"],

  suspension: ["shock", "strut"],
  shock: ["suspension"],
  strut: ["suspension"],

  alignment: ["align", "wheel alignment"],
  align: ["alignment"],


  emergency: ["urgent", "immediate"],
  urgent: ["emergency", "immediate"],
  roadside: ["road side", "on road"],
}

const synonymMap: Record<string, string[]> = {}
Object.entries(spellCorrections).forEach(([key, values]) => {
  values.forEach((value) => {
    if (!synonymMap[value]) synonymMap[value] = []
    synonymMap[value].push(key)
  })
})

const searchData: SearchResult[] = [

  {
    id: "flat-tire",
    title: "Flat Tire Repair",
    category: "Emergency Assistance",
    description: "Replacement or repair of flat tires",
    href: "/roadside-assistance",
    icon: Car,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    id: "jump-start",
    title: "Jump Start Service",
    category: "Emergency Assistance",
    description: "Boost dead batteries to get the engine running again",
    href: "/roadside-assistance",
    icon: Car,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    id: "vehicle-lockout",
    title: "Vehicle Lockout",
    category: "Emergency Assistance",
    description: "Unlock car doors using locksmith tools without damaging the vehicle",
    href: "/roadside-assistance",
    icon: Car,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    id: "engine-overheating",
    title: "Engine Overheating",
    category: "Emergency Assistance",
    description: "On-site cooling system check and coolant refill",
    href: "/roadside-assistance",
    icon: Car,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    id: "brake-emergency",
    title: "Brake Emergency",
    category: "Emergency Assistance",
    description: "Inspection and quick fix of critical brake issues",
    href: "/roadside-assistance",
    icon: Car,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    id: "towing-service",
    title: "Towing Service",
    category: "Emergency Assistance",
    description: "Transport the vehicle safely to a garage or service center",
    href: "/roadside-assistance",
    icon: Car,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    id: "electrical-problems",
    title: "Electrical Problems",
    category: "Emergency Assistance",
    description: "Diagnose and repair wiring or battery-related issues",
    href: "/roadside-assistance",
    icon: Car,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  // Video Diagnostics Services
  {
    id: "video-support",
    title: "Step-by-Step Video Call Support",
    category: "Video Diagnostics",
    description: "Certified mechanics guide you through simple checks/fixes via live video",
    href: "/video-diagnostics",
    icon: Video,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
  },
  {
    id: "diy-repairs",
    title: "Minor DIY Repairs Consultation",
    category: "Video Diagnostics",
    description: "Help with fuse replacement, fluid top-ups, or dashboard warning interpretation",
    href: "/video-diagnostics",
    icon: Video,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
  },
  {
    id: "second-opinion",
    title: "Second Opinion on Repairs",
    category: "Video Diagnostics",
    description: "Expert reviews what another mechanic diagnosed",
    href: "/video-diagnostics",
    icon: Video,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
  },
  {
    id: "maintenance-query",
    title: "Maintenance Query Resolution",
    category: "Video Diagnostics",
    description: "Ask about oil type, service intervals, tire pressure, etc.",
    href: "/video-diagnostics",
    icon: Video,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
  },
  // Pre-Trip Inspection Services
  {
    id: "comprehensive-inspection",
    title: "Comprehensive Vehicle Inspection",
    category: "Pre-Trip Inspection",
    description: "Overall condition check (fluids, tires, brakes, lights)",
    href: "/pretrip-checkup/plans",
    icon: CheckCircle,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
  {
    id: "battery-test",
    title: "Battery & Charging System Test",
    category: "Pre-Trip Inspection",
    description: "Ensure the battery is ready for the road",
    href: "/pretrip-checkup/plans",
    icon: CheckCircle,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
  {
    id: "brake-suspension",
    title: "Brake & Suspension Check",
    category: "Pre-Trip Inspection",
    description: "Make sure the car handles well and stops efficiently",
    href: "/pretrip-checkup/plans",
    icon: CheckCircle,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
  {
    id: "tire-alignment",
    title: "Tire & Alignment Check",
    category: "Pre-Trip Inspection",
    description: "Evaluate tire wear, alignment, and air pressure",
    href: "/pretrip-checkup/plans",
    icon: CheckCircle,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
  {
    id: "emergency-kit",
    title: "Emergency Kit Review",
    category: "Pre-Trip Inspection",
    description: "Check if first-aid kit, jack, and tools are available",
    href: "/pretrip-checkup/plans",
    icon: CheckCircle,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
]

interface SearchBarProps {
  isNavbar?: boolean
  onClose?: () => void
}

// Simple Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[str2.length][str1.length]
}

// Enhanced search function with spell correction
function enhancedSearch(query: string, data: SearchResult[]): { results: SearchResult[]; suggestion?: string } {
  const normalizedQuery = query.toLowerCase().trim()

  // Direct search first
  const directResults = data.filter(
    (item) =>
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery),
  )

  if (directResults.length > 0) {
    return { results: directResults }
  }

  let correctedQuery = normalizedQuery
  let suggestion: string | undefined

  const words = normalizedQuery.split(" ")
  const correctedWords = words.map((word) => {
    if (spellCorrections[word]) {
      suggestion = spellCorrections[word][0]
      return spellCorrections[word][0]
    }


    if (synonymMap[word]) {
      suggestion = synonymMap[word][0]
      return synonymMap[word][0]
    }

    let bestMatch = word
    let bestDistance = Number.POSITIVE_INFINITY

    Object.keys(spellCorrections).forEach((key) => {
      const distance = levenshteinDistance(word, key)
      if (distance <= 2 && distance < bestDistance && key.length > 2) {
        bestDistance = distance
        bestMatch = key
        suggestion = key
      }
    })

    return bestMatch
  })

  correctedQuery = correctedWords.join(" ")

  const correctedResults = data.filter(
    (item) =>
      item.title.toLowerCase().includes(correctedQuery) ||
      item.description.toLowerCase().includes(correctedQuery) ||
      item.category.toLowerCase().includes(correctedQuery) ||
      correctedWords.some(
        (word) => item.title.toLowerCase().includes(word) || item.description.toLowerCase().includes(word),
      ),
  )

  return {
    results: correctedResults,
    suggestion: suggestion && suggestion !== normalizedQuery ? suggestion : undefined,
  }
}

export default function SearchBar({ isNavbar = false, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestion, setSuggestion] = useState<string>()
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (query.trim()) {
      const { results: searchResults, suggestion: searchSuggestion } = enhancedSearch(query, searchData)
      setResults(searchResults)
      setSuggestion(searchSuggestion)
      setSelectedIndex(-1)
    } else {
      setResults([])
      setSuggestion(undefined)
    }
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = results.length + (suggestion ? 1 : 0)

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex === 0 && suggestion) {

        setQuery(suggestion)
        setSelectedIndex(-1)
      } else if (selectedIndex >= (suggestion ? 1 : 0)) {

        const resultIndex = selectedIndex - (suggestion ? 1 : 0)
        if (results[resultIndex]) {
          handleResultClick(results[resultIndex])
        }
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleResultClick = (result: SearchResult) => {
    navigate(result.href)
    setQuery("")
    setIsOpen(false)
    onClose?.()
  }

  const handleSuggestionClick = () => {
    if (suggestion) {
      setQuery(suggestion)
      inputRef.current?.focus()
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setSuggestion(undefined)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  return (
    <div ref={searchRef} className={`relative ${isNavbar ? "w-80" : "w-full max-w-2xl mx-auto"}`}>
      <div className="relative">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search automotive services..."
            className={`w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 placeholder-gray-400 ${
              isNavbar ? "text-sm h-11" : "text-base h-12"
            } ${isOpen && (results.length > 0 || suggestion) ? "rounded-b-none border-b-0" : ""}`}
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {isOpen && (query.trim() || results.length > 0 || suggestion) && (
          <div className="absolute top-full left-0 right-0 bg-white border-2 border-t-0 border-gray-200 rounded-b-xl shadow-xl z-50 max-h-80 overflow-y-auto">
            {/* Suggestion */}
            {suggestion && (
              <div
                className={`flex items-center space-x-3 p-3 cursor-pointer transition-all duration-150 mx-2 rounded-lg border-b border-gray-100 ${
                  selectedIndex === 0 ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={handleSuggestionClick}
              >
                <div className="p-2 rounded-lg bg-gray-100 flex-shrink-0">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Did you mean:</span>
                    <span className="font-semibold text-blue-600 text-sm">{suggestion}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => {
                  const IconComponent = result.icon
                  const adjustedIndex = index + (suggestion ? 1 : 0)
                  return (
                    <div
                      key={result.id}
                      className={`flex items-center space-x-3 p-3 cursor-pointer transition-all duration-150 mx-2 rounded-lg ${
                        selectedIndex === adjustedIndex ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleResultClick(result)}
                    >
                      <div className={`p-2 rounded-lg ${result.iconBg} flex-shrink-0`}>
                        <IconComponent className={`h-4 w-4 ${result.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate mb-1">{result.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{result.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : query.trim() && !suggestion ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">No services found</h3>
                <p className="text-gray-500 text-xs mb-3">Try searching for:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">tire repair</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">battery</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">inspection</span>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
