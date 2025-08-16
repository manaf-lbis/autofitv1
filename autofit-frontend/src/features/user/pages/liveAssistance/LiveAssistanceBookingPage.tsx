import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Clock, Users, MessageSquare, Wrench, Shield, Star, ArrowLeft } from "lucide-react"
import { useCreateBookingMutation } from "@/services/userServices/liveAssistanceApi"
import { toast } from "react-toastify"

export default function VideoDiagnosisPage() {
  const [selectedConcern, setSelectedConcern] = useState("")
  const [issueDescription, setIssueDescription] = useState("")
  const [errors, setErrors] = useState({ concern: "", description: "" })
  const [createBooking,{isLoading}] = useCreateBookingMutation()

  const driverConcerns = [
    "Strange Noises",
    "Dashboard Warning Lights",
    "Performance Issues",
    "Maintenance Questions",
    "DIY Repair Guidance",
    "Pre-Purchase Inspection",
    "Fluid Leaks",
    "Tire & Wheel Issues",
    "Battery & Charging",
    "General Car Care Tips",
    "Other Concerns",
  ]

  const validateForm = () => {
    const newErrors = { concern: "", description: "" }
    let isValid = true

    if (!selectedConcern) {
      newErrors.concern = "Please select a type of concern"
      isValid = false
    }

    if (!issueDescription.trim()) {
      newErrors.description = "Please describe your issue"
      isValid = false
    } else if (issueDescription.trim().length < 10) {
      newErrors.description = "Please provide more details (at least 10 characters)"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await createBooking({
        concern: selectedConcern,
        description: issueDescription
      }).unwrap()

      setSelectedConcern("")
      setIssueDescription("")
      setErrors({ concern: "", description: "" })
    } catch (error:any) {
        toast.error(error?.data.message)
    }
  }

  const handleConcernChange = (value: string) => {
    setSelectedConcern(value)
    if (errors.concern) {
      setErrors((prev) => ({ ...prev, concern: "" }))
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIssueDescription(e.target.value)
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden mt-16">


      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Video Diagnosis</h1>
        </div>

        <div className="w-full grid lg:grid-cols-3 gap-6 lg:gap-8 min-w-0">
          <div className="lg:col-span-2 space-y-6 min-w-0">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900">30-Minute Video Consultation</CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Professional automotive guidance via secure video call
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">₹299</div>
                    <div className="text-sm text-gray-500">30 minutes</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">What We Help With</CardTitle>
                <CardDescription className="text-gray-600">
                  Our certified mechanics assist with various automotive concerns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-700">DIY Repair Guidance</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Maintenance Questions</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Diagnostic Support</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Star className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Expert Advice</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Service Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Real-time Diagnosis</h4>
                      <p className="text-sm text-gray-600">Show your issue live and get immediate feedback</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Certified Mechanics</h4>
                      <p className="text-sm text-gray-600">5+ years of professional experience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Quick Connection</h4>
                      <p className="text-sm text-gray-600">Connect within 5 minutes or get refunded</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 min-w-0 w-full">
            <Card className="bg-white border border-gray-200 shadow-sm sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Book Consultation</CardTitle>
                <CardDescription className="text-gray-600">Tell us about your automotive concern</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="concern-select" className="text-sm font-medium text-gray-700">
                      Type of Concern
                    </Label>
                    <Select value={selectedConcern} onValueChange={handleConcernChange}>
                      <SelectTrigger
                        id="concern-select"
                        className={`w-full h-10 border bg-white ${errors.concern ? "border-red-300" : "border-gray-300"}`}
                      >
                        <SelectValue placeholder="Select your concern" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {driverConcerns.map((concern) => (
                          <SelectItem key={concern} value={concern}>
                            {concern}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.concern && <p className="text-sm text-red-600">{errors.concern}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue-description" className="text-sm font-medium text-gray-700">
                      Describe Your Issue
                    </Label>
                    <Textarea
                      id="issue-description"
                      placeholder="Please describe what you're experiencing or the guidance you need..."
                      value={issueDescription}
                      onChange={handleDescriptionChange}
                      className={`w-full min-h-[100px] resize-none border bg-white ${errors.description ? "border-red-300" : "border-gray-300"}`}
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Booking..." : "Start Video Call - ₹299"}
                  </Button>
                </form>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Duration:</span>
                    <span>30 minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                    <span>Response time:</span>
                    <span>Within 5 minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
