import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Briefcase, Building2, } from "lucide-react"
import LocationInput from "@/components/shared/LocationInput/LocationInput"
import { useForm } from "react-hook-form"


interface ProfileData {
  name: string
  email: string
  mobile: string
  education: string
  location: string
  specialised: string
  experience: string
  shopName: string
  place: string
  landmark: string
}

interface UpdateProfileModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: ProfileData
  onSave: (data: ProfileData) => void
}

interface ValidationErrors {
  [key: string]: string
}

interface FormData {
  location  : string
}

export function UpdateProfileModal({ isOpen, onClose, initialData, onSave }: UpdateProfileModalProps) {

  const { register, handleSubmit, formState: { errors: formErrors }, setValue } = useForm<FormData>();
  const [formData, setFormData] = useState<ProfileData>(initialData)
  const [errors, setErrors] = useState<ValidationErrors>({})


  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!formData.name?.trim()) newErrors.name = "Name is required"
    if (!formData.email?.trim()) newErrors.email = "Email is required"
    if (!formData.mobile?.trim()) newErrors.phone = "Phone is required"
    if (!formData.education?.trim()) newErrors.education = "Education is required"
    if (!formData.specialised?.trim()) newErrors.specializedOn = "Specialization is required"
    if (isNaN(Number(formData.experience)) || Number(formData.experience) <= 0) newErrors.experience = "Experience is required in Years"
    if (!formData.shopName?.trim()) newErrors.shopName = "Shop name is required"
    if (!formData.place?.trim()) newErrors.place = "Place is required"
    if (!formData.landmark?.trim()) newErrors.landmark = "Landmark is required"

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.mobile && !/^\+?[\d\s\-$$$$]{10,}$/.test(formData.mobile)) {
      newErrors.phone = "Please enter a valid phone number"
    }


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSave = (data: FormData) => {
    if (validateForm()) {
      onSave({...formData,...data})
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-[95vh] overflow-hidden p-0 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-2xl">
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              Update Profile
            </DialogTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Keep your profile information up to date</p>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8 pb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-slate-700">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-white">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className={`h-12 border-2 transition-colors bg-white dark:bg-slate-800 ${errors.name
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-slate-600 focus:border-indigo-500"
                      }`}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    className={`h-12 border-2 transition-colors bg-white dark:bg-slate-800 ${errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-slate-600 focus:border-indigo-500"
                      }`}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-900 dark:text-white">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  placeholder="Enter your phone number"
                  className={`h-12 border-2 transition-colors bg-white dark:bg-slate-800 ${errors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-slate-600 focus:border-indigo-500"
                    }`}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-slate-700">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Professional Details</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="education" className="text-sm font-medium text-gray-900 dark:text-white">
                    Education Background *
                  </Label>
                  <Input
                    id="education"
                    value={formData.education}
                    onChange={(e) => handleInputChange("education", e.target.value)}
                    placeholder="Enter your education background"
                    className={`h-12 border-2 transition-colors bg-white dark:bg-slate-800 ${errors.education
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-slate-600 focus:border-indigo-500"
                      }`}
                  />
                  {errors.education && <p className="text-sm text-red-500">{errors.education}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="specializedOn" className="text-sm font-medium text-gray-900 dark:text-white">
                      Area of Specialization *
                    </Label>
                    <Input
                      id="specializedOn"
                      value={formData.specialised}
                      onChange={(e) => handleInputChange("specialised", e.target.value)}
                      placeholder="Your specialization"
                      className={`h-12 border-2 transition-colors bg-white dark:bg-slate-800 ${errors.specializedOn
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-slate-600 focus:border-indigo-500"
                        }`}
                    />
                    {errors.specializedOn && <p className="text-sm text-red-500">{errors.specializedOn}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium text-gray-900 dark:text-white">
                      Years of Experience *
                    </Label>
                    <Input
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      placeholder="e.g., 5 years"
                      className={`h-12 border-2 transition-colors bg-white dark:bg-slate-800 ${errors.experience
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-slate-600 focus:border-indigo-500"
                        }`}
                    />
                    {errors.experience && <p className="text-sm text-red-500">{errors.experience}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-slate-700">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location & Shop Details</h3>
              </div>

              <div className="space-y-6">



                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Location</Label>
                  <LocationInput
                    id="location"
                    label="Pick Your Location"
                    name="location"
                    register={register}
                    error={formErrors.location}
                    setValue={setValue}
                    defaultValue={initialData?.location}
                  />
                </div>


                {/* <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Location</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLocationPicker}
                    className="w-full h-12 justify-start border-2 border-gray-300 dark:border-slate-600 hover:border-indigo-500 transition-colors bg-white dark:bg-slate-800"
                  >
                    <MapPin className="h-5 w-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                    Pick Your Location
                  </Button>
                </div> */}





                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="shopName" className="text-sm font-medium text-gray-900 dark:text-white">
                      Shop Name *
                    </Label>
                    <Input
                      id="shopName"
                      value={formData.shopName}
                      onChange={(e) => handleInputChange("shopName", e.target.value)}
                      placeholder="Enter shop name"
                      className={`h-12 border-2 transition-colors bg-white dark:bg-slate-800 ${errors.shopName
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-slate-600 focus:border-indigo-500"
                        }`}
                    />
                    {errors.shopName && <p className="text-sm text-red-500">{errors.shopName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="place" className="text-sm font-medium text-gray-900 dark:text-white">
                      Place/City *
                    </Label>
                    <Input
                      id="place"
                      value={formData.place}
                      onChange={(e) => handleInputChange("place", e.target.value)}
                      placeholder="Enter place or city"
                      className={`h-12 border-2 transition-colors bg-white dark:bg-slate-800 ${errors.place
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-slate-600 focus:border-indigo-500"
                        }`}
                    />
                    {errors.place && <p className="text-sm text-red-500">{errors.place}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landmark" className="text-sm font-medium text-gray-900 dark:text-white">
                    Nearby Landmark *
                  </Label>
                  <Input
                    id="landmark"
                    value={formData.landmark}
                    onChange={(e) => handleInputChange("landmark", e.target.value)}
                    placeholder="Enter nearby landmark"
                    className={`h-12 border-2 transition-colors bg-white dark:bg-slate-800 ${errors.landmark
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-slate-600 focus:border-indigo-500"
                      }`}
                  />
                  {errors.landmark && <p className="text-sm text-red-500">{errors.landmark}</p>}
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto h-12 px-8 border-2 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(handleSave)}
              className="w-full sm:w-auto h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}







