import { useState, useEffect } from "react"
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  Loader2,
  AlertTriangle,
  Copy,
  Sparkles,
  Eye,
  ChevronRight,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import {
  useGetPlansQuery,
  useGetFeaturesQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useTogglePlanStatusMutation,
  useCreateFeatureMutation,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
} from '@/services/adminServices/planApi'
import { Plan, Feature } from "@/types/plans"

type CreatePlanRequest = {
  name: string
  description: string
  price: string
  originalPrice: string
  features: string[]
  isPopular: boolean
}

export default function AdminPlansPage() {
  const { data: plans = [], isLoading: plansLoading } = useGetPlansQuery()
  const { data: features = [], isLoading: featuresLoading } = useGetFeaturesQuery()
  const [createPlan] = useCreatePlanMutation()
  const [updatePlan] = useUpdatePlanMutation()
  const [deletePlan] = useDeletePlanMutation()
  const [togglePlanStatus] = useTogglePlanStatusMutation()
  const [createFeature] = useCreateFeatureMutation()
  const [updateFeature] = useUpdateFeatureMutation()
  const [deleteFeature] = useDeleteFeatureMutation()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null)
  const [featureToDelete, setFeatureToDelete] = useState<Feature | null>(null)
  const [formData, setFormData] = useState<CreatePlanRequest>({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    features: [],
    isPopular: false,
  })
  const [selectedInheritPlan, setSelectedInheritPlan] = useState<string>("none")
  const [newFeatureName, setNewFeatureName] = useState("")
  const [editFeatureName, setEditFeatureName] = useState("")
  const [validationError, setValidationError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", originalPrice: "", features: [], isPopular: false })
    setSelectedInheritPlan("none")
    setValidationError("")
  }

  useEffect(() => {
    if (isCreateOpen) {
      resetForm()
    }
  }, [isCreateOpen])

  useEffect(() => {
    if (!featureToDelete && isFeaturesOpen) {
      document.body.style.pointerEvents = "auto"
      document.body.removeAttribute("data-scroll-locked")
    }
  }, [featureToDelete, isFeaturesOpen])

  const validateForm = () => {
    if (!formData.name.trim()) return setValidationError("Plan name is required"), false
    if (!formData.description.trim()) return setValidationError("Description is required"), false
    if (!formData.price || Number(formData.price) <= 0) return setValidationError("Price must be greater than 0"), false
    if (formData.originalPrice && Number(formData.originalPrice) < Number(formData.price))
      return setValidationError("Original price must be greater than price"), false
    if (formData.features.length === 0) return setValidationError("At least one feature is required"), false
    setValidationError("")
    return true
  }

  const handleCreate = async () => {
    if (!validateForm()) return
    setSubmitting(true)
    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      }
      await createPlan(submitData).unwrap()
      setIsCreateOpen(false)
      resetForm()
    } catch (error: any) {
      setValidationError(error.data?.message || "Failed to create plan")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      originalPrice: plan.originalPrice?.toString() || "",
      features: plan.features,
      isPopular: plan.isPopular,
    })
    setSelectedInheritPlan("none")
    setValidationError("")
  }

  const handleUpdate = async () => {
    if (!validateForm() || !editingPlan) return
    setSubmitting(true)
    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      }
      await updatePlan({ planId: editingPlan._id, data: submitData }).unwrap()
      setEditingPlan(null)
      resetForm()
    } catch (error: any) {
      setValidationError(error.data?.message || "Failed to update plan")
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDeletePlan = async () => {
    if (!planToDelete) return
    try {
      await deletePlan(planToDelete._id).unwrap()
      setPlanToDelete(null)
    } catch (error) {
      console.error("Failed to delete plan:", error)
      setValidationError("Failed to delete plan. Please try again.")
    }
  }

  const handleTogglePlanStatus = async (planId: string) => {
    try {
      await togglePlanStatus(planId).unwrap()
    } catch (error) {
      console.error("Failed to toggle plan status:", error)
    }
  }

  const addNewFeature = async () => {
    if (!newFeatureName.trim()) return
    try {
      await createFeature(newFeatureName).unwrap()
      setNewFeatureName("")
    } catch (error) {
      console.error("Failed to create feature:", error)
      setValidationError("Failed to create feature. Please try again.")
    }
  }

  const updateFeatureAction = async () => {
    if (!editingFeature || !editFeatureName.trim()) return
    try {
      await updateFeature({ featureId: editingFeature._id, name: editFeatureName }).unwrap()
      setEditingFeature(null)
      setEditFeatureName("")
    } catch (error) {
      console.error("Failed to update feature:", error)
      setValidationError("Failed to update feature. Please try again.")
    }
  }

  const confirmDeleteFeature = async () => {
    if (!featureToDelete) return
    try {
      await deleteFeature(featureToDelete._id).unwrap()
      setFeatureToDelete(null)
    } catch (error) {
      console.error("Failed to delete feature:", error)
      setValidationError("Failed to delete feature. Please try again.")
    }
  }

  const inheritFeaturesFromPlan = (planId: string) => {
    setSelectedInheritPlan(planId)
    if (planId === "none") {
      setFormData({ ...formData, features: [] })
      return
    }
    const selectedPlan = plans.find((p) => p._id === planId)
    if (selectedPlan) {
      console.log("Inheriting features:", selectedPlan.features)
      setFormData({ ...formData, features: [...new Set(selectedPlan.features)] })
      setValidationError("")
    }
  }

  const clearInheritedFeatures = () => {
    setSelectedInheritPlan("none")
    setFormData({ ...formData, features: [] })
  }

  const getPlansUsingFeature = (featureId: string): Plan[] => {
    return plans.filter((plan) => plan.features.includes(featureId))
  }

  const getSelectedInheritPlan = () => {
    return plans.find((p) => p._id === selectedInheritPlan)
  }

  if (plansLoading || featuresLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
            <div className="absolute inset-0 w-10 h-10 border-4 border-blue-200 rounded-full mx-auto animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-slate-700">Loading Plans</p>
            <p className="text-sm text-slate-500">Setting up your workspace...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 w-full p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="relative overflow-hidden rounded-lg bg-white p-4 sm:p-6 shadow-sm border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">Plans Management</h1>
              </div>
              <p className="text-slate-600 text-sm">
                Create and manage your service plans with advanced features
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  {plans.length} Active Plans
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  {features.length} Features Available
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Dialog open={isFeaturesOpen} onOpenChange={setIsFeaturesOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-slate-300 hover:bg-slate-50 bg-transparent text-sm pointer-events-auto"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Manage Features
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-2xl h-[80vh] flex flex-col bg-white rounded-lg shadow-lg border-0 p-0 pointer-events-auto">
                  <DialogHeader className="border-b border-slate-200 p-4">
                    <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-600" />
                      Feature Management
                    </DialogTitle>
                    <p className="text-slate-600 mt-1 text-sm">
                      Add, edit, and organize your plan features
                    </p>
                  </DialogHeader>
                  <div className="border-b border-slate-200 p-4 bg-white">
                    <div className="rounded-lg p-4 border border-blue-200 bg-blue-50">
                      <Label className="text-sm font-semibold text-slate-900 mb-3 block">
                        Add New Feature
                      </Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          value={newFeatureName}
                          onChange={(e) => setNewFeatureName(e.target.value)}
                          placeholder="Enter feature name..."
                          onKeyDown={(e) => e.key === "Enter" && addNewFeature()}
                          className="flex-1 border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm pointer-events-auto"
                        />
                        <Button
                          onClick={addNewFeature}
                          disabled={!newFeatureName.trim()}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 w-full sm:w-auto text-sm pointer-events-auto"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold text-slate-900">All Features</Label>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                          {features.length} total
                        </Badge>
                      </div>
                      <div className="grid gap-2">
                        {features.map((feature: Feature) => {
                          const plansUsing = getPlansUsingFeature(feature._id)
                          return (
                            <Card
                              key={feature._id}
                              className="border border-slate-200 hover:border-blue-300 transition-colors pointer-events-auto"
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-slate-900 text-sm truncate">{feature.name}</div>
                                    {plansUsing.length > 0 && (
                                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <Eye className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">
                                          Used in: {plansUsing.map((p) => p.name).join(", ")}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-1 flex-shrink-0">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setEditingFeature(feature)
                                        setEditFeatureName(feature.name)
                                      }}
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 pointer-events-auto"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setFeatureToDelete(feature)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 pointer-events-auto"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                        {features.length === 0 && (
                          <div className="text-center py-8 text-slate-500">
                            <Settings className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                            <p className="text-sm font-medium">No features yet</p>
                            <p className="text-xs">Add your first feature above</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg w-full sm:w-auto text-sm pointer-events-auto">
                    <Plus className="w-3 h-3 mr-1" />
                    Create Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-3xl h-[85vh] flex flex-col bg-white rounded-lg shadow-lg border-0 p-0 pointer-events-auto">
                  <DialogHeader className="border-b border-slate-200 p-4">
                    <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-blue-600" />
                      Create New Plan
                    </DialogTitle>
                    <p className="text-slate-600 mt-1 text-sm">
                      Design your perfect pricing plan with advanced features
                    </p>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto p-4">
                    <PlanForm
                      formData={formData}
                      setFormData={setFormData}
                      features={features}
                      plans={plans}
                      onSubmit={handleCreate}
                      onCancel={() => {
                        setIsCreateOpen(false)
                        resetForm()
                      }}
                      validationError={validationError}
                      submitting={submitting}
                      onInheritFeatures={inheritFeaturesFromPlan}
                      selectedInheritPlan={selectedInheritPlan}
                      getSelectedInheritPlan={getSelectedInheritPlan}
                      clearInheritedFeatures={clearInheritedFeatures}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan._id}
              className={`relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-lg flex flex-col ${
                plan.isPopular ? "border-2 border-orange-400" : "border border-slate-200"
              } pointer-events-auto`}
            >
              <CardHeader className="pb-3 flex-shrink-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <CardTitle className="text-lg font-bold text-slate-900 truncate">
                      {plan.name}
                    </CardTitle>
                    <p className="text-slate-600 text-xs line-clamp-2">{plan.description}</p>
                  </div>
                  <Switch
                    checked={plan.isActive}
                    onCheckedChange={() => handleTogglePlanStatus(plan._id)}
                    className="data-[state=checked]:bg-green-500 flex-shrink-0 ml-2 pointer-events-auto"
                  />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-slate-900">
                    ₹{plan.price.toLocaleString()}
                  </span>
                  {plan.originalPrice && plan.originalPrice > plan.price && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{plan.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 flex-1">
                <Separator className="bg-slate-100" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900 text-sm">Features</h4>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                      {plan.features.length} included
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {plan.features.slice(0, 4).map((featureId) => (
                      <div key={featureId} className="flex items-center gap-2 text-xs text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2 h-2 text-green-600" />
                        </div>
                        <span className="truncate">{features.find((f: Feature) => f._id === featureId)?.name || "Unknown"}</span>
                      </div>
                    ))}
                    {plan.features.length > 4 && (
                      <div className="text-xs text-slate-500 pl-6">+{plan.features.length - 4} more features</div>
                    )}
                  </div>
                </div>
              </CardContent>
              <div className="border-t border-slate-100 p-4 bg-slate-50/50 mt-auto">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 text-sm bg-transparent pointer-events-auto"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 text-sm bg-transparent pointer-events-auto"
                    onClick={() => setPlanToDelete(plan)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {plans.length === 0 && (
          <Card className="text-center py-8 bg-white rounded-lg shadow-lg border-0 pointer-events-auto">
            <CardContent className="space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No plans yet</h3>
                <p className="text-slate-600 max-w-md mx-auto text-sm">
                  Get started by creating your first pricing plan. You can inherit features from existing plans to save time.
                </p>
              </div>
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm pointer-events-auto"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create Your First Plan
              </Button>
            </CardContent>
          </Card>
        )}
        {editingPlan && (
          <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
            <DialogContent className="w-[95vw] max-w-3xl h-[85vh] flex flex-col bg-white rounded-lg shadow-lg border-0 p-0 pointer-events-auto">
              <DialogHeader className="border-b border-slate-200 p-4">
                <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Edit className="w-4 h-4 text-blue-600" />
                  <span className="truncate">Edit Plan: {editingPlan.name}</span>
                </DialogTitle>
                <p className="text-slate-600 mt-1 text-sm">Update your plan details and features</p>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto p-4">
                <PlanForm
                  formData={formData}
                  setFormData={setFormData}
                  features={features}
                  plans={plans}
                  onSubmit={handleUpdate}
                  onCancel={() => {
                    setEditingPlan(null)
                    resetForm()
                  }}
                  validationError={validationError}
                  submitting={submitting}
                  onInheritFeatures={inheritFeaturesFromPlan}
                  selectedInheritPlan={selectedInheritPlan}
                  getSelectedInheritPlan={getSelectedInheritPlan}
                  clearInheritedFeatures={clearInheritedFeatures}
                  isEditing
                  editingPlanId={editingPlan._id}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
        {editingFeature && (
          <Dialog open={!!editingFeature} onOpenChange={() => setEditingFeature(null)}>
            <DialogContent className="w-[95vw] max-w-sm bg-white rounded-lg shadow-lg border-0 pointer-events-auto">
              <DialogHeader className="border-b border-slate-200 pb-3">
                <DialogTitle className="text-base font-bold text-slate-900">Edit Feature</DialogTitle>
              </DialogHeader>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">Feature Name</Label>
                  <Input
                    value={editFeatureName}
                    onChange={(e) => setEditFeatureName(e.target.value)}
                    placeholder="Enter feature name"
                    className="border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm pointer-events-auto"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={updateFeatureAction}
                    disabled={!editFeatureName.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm pointer-events-auto"
                  >
                    Update Feature
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingFeature(null)}
                    className="flex-1 border-slate-200 text-sm pointer-events-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <AlertDialog
          open={!!planToDelete}
          onOpenChange={(open) => {
            setPlanToDelete(null)
            if (!open) {
              document.body.style.pointerEvents = "auto"
              document.body.removeAttribute("data-scroll-locked")
            }
          }}
        >
          <AlertDialogContent className="w-[95vw] max-w-sm bg-white rounded-lg shadow-lg border-0 pointer-events-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Delete Plan
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600 space-y-3 text-sm">
                <p>Are you sure you want to delete "{planToDelete?.name}"?</p>
                {planToDelete && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
                    <p className="font-semibold text-red-800 text-xs">This action cannot be undone</p>
                    <div className="text-red-700 text-xs space-y-1">
                      <p>• Plan: {planToDelete.name}</p>
                      <p>• Price: ₹{planToDelete.price.toLocaleString()}</p>
                      <p>• Features: {planToDelete.features.length}</p>
                      <p>• Status: {planToDelete.isActive ? "Active" : "Inactive"}</p>
                    </div>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-3 flex-col sm:flex-row gap-2">
              <AlertDialogCancel
                className="border-slate-200 w-full sm:w-auto text-sm pointer-events-auto"
                onClick={() => {
                  document.body.style.pointerEvents = "auto"
                  document.body.removeAttribute("data-scroll-locked")
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeletePlan}
                className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto text-sm pointer-events-auto"
              >
                Delete Plan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog
          open={!!featureToDelete}
          onOpenChange={(open) => {
            setFeatureToDelete(null)
            if (!open) {
              document.body.style.pointerEvents = "auto"
              document.body.removeAttribute("data-scroll-locked")
            }
          }}
        >
          <AlertDialogContent className="w-[95vw] max-w-sm bg-white rounded-lg shadow-lg border-0 pointer-events-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Delete Feature
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600 space-y-3 text-sm">
                <p>Are you sure you want to delete "{featureToDelete?.name}"?</p>
                {featureToDelete && getPlansUsingFeature(featureToDelete._id).length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="font-semibold text-red-800 text-xs">Warning</p>
                    <p className="text-red-700 text-xs">
                      This feature is used in {getPlansUsingFeature(featureToDelete._id).length} plans and will be removed from them.
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-3 flex-col sm:flex-row gap-2">
              <AlertDialogCancel
                className="border-slate-200 w-full sm:w-auto text-sm pointer-events-auto"
                onClick={() => {
                  document.body.style.pointerEvents = "auto"
                  document.body.removeAttribute("data-scroll-locked")
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteFeature}
                className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto text-sm pointer-events-auto"
              >
                Delete Feature
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}

interface PlanFormProps {
  formData: CreatePlanRequest
  setFormData: (data: CreatePlanRequest) => void
  features: Feature[]
  plans: Plan[]
  onSubmit: () => void
  onCancel: () => void
  validationError: string
  submitting: boolean
  onInheritFeatures: (planId: string) => void
  selectedInheritPlan: string
  getSelectedInheritPlan: () => Plan | undefined
  clearInheritedFeatures: () => void
  isEditing?: boolean
  editingPlanId?: string
}

function PlanForm({
  formData,
  setFormData,
  features,
  plans,
  onSubmit,
  onCancel,
  validationError,
  submitting,
  onInheritFeatures,
  selectedInheritPlan,
  getSelectedInheritPlan,
  clearInheritedFeatures,
  isEditing,
  editingPlanId,
}: PlanFormProps) {
  const getFeatureName = (featureId: string): string => {
    const feature = features.find((f: Feature) => f._id === featureId)
    return feature?.name || "Unknown"
  }

  const handleFeatureToggle = (featureId: string) => {
    const newFeatures = formData.features.includes(featureId)
      ? formData.features.filter((id) => id !== featureId)
      : [...formData.features, featureId]
    setFormData({ ...formData, features: newFeatures })
  }

  const availablePlansForInheritance = plans.filter((plan) => plan._id !== editingPlanId)

  useEffect(() => {
    console.log("Available plans for inheritance:", availablePlansForInheritance)
  }, [availablePlansForInheritance])

  const inheritedPlan = getSelectedInheritPlan()

  return (
    <div className="space-y-4 sm:space-y-6 pointer-events-auto">
      {validationError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="w-3 h-3 text-red-600" />
          <AlertDescription className="text-red-800 text-sm">{validationError}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900">Basic Information</h3>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700">Plan Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Professional Plan"
              className="border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm pointer-events-auto"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700">Price (₹) *</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="2999"
              className="border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm pointer-events-auto"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700">Original Price (₹)</Label>
            <Input
              type="number"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              placeholder="3999 (optional)"
              className="border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm pointer-events-auto"
            />
            <p className="text-xs text-slate-500">Show crossed-out original price for discounts</p>
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <Checkbox
              checked={formData.isPopular}
              onCheckedChange={(checked) => setFormData({ ...formData, isPopular: !!checked })}
              className="border-slate-300 pointer-events-auto"
            />
            <Label className="text-xs font-semibold text-slate-700">Mark as Popular Plan</Label>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-700">Description *</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of what this plan offers..."
            rows={3}
            className="border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm pointer-events-auto"
          />
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900">Feature Inheritance</h3>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Copy className="w-4 h-4 text-blue-600" />
              <Label className="text-sm font-semibold text-slate-900">
                Copy Features From Existing Plan
              </Label>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select onValueChange={onInheritFeatures} value={selectedInheritPlan}>
                <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white flex-1 text-sm pointer-events-auto">
                  <SelectValue placeholder="Choose a plan to inherit features from..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      None (Clear all features)
                    </div>
                  </SelectItem>
                  {availablePlansForInheritance.length > 0 ? (
                    availablePlansForInheritance.map((plan) => (
                      <SelectItem key={plan._id} value={plan._id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${plan.isPopular ? "bg-orange-400" : "bg-blue-400"}`}></div>
                          {plan.name} ({plan.features.length} features)
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-plans" disabled>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        No plans available
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {selectedInheritPlan !== "none" && (
                <Button
                  variant="outline"
                  onClick={clearInheritedFeatures}
                  className="border-slate-200 hover:bg-slate-50 w-full sm:w-auto text-sm pointer-events-auto"
                >
                  Clear Inheritance
                </Button>
              )}
            </div>
            {inheritedPlan && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-3 h-3 text-blue-600" />
                  <span className="font-medium text-slate-900 text-sm">Preview: {inheritedPlan.name}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                    {inheritedPlan.features.length} features
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {inheritedPlan.features.map((featureId) => (
                    <div key={featureId} className="flex items-center gap-2 text-slate-600">
                      <ChevronRight className="w-3 h-3 text-blue-500 flex-shrink-0" />
                      <span className="truncate">{getFeatureName(featureId)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-blue-700 bg-blue-100 rounded-lg p-2">
              💡 <strong>Tip:</strong> Select a plan to copy its features. Add or remove features below; deletion updates all associated plans.
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">Features Selection</h3>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
            {formData.features.length} selected
          </Badge>
        </div>
        <div className="border border-slate-200 rounded-lg p-4 bg-white">
          {features.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {features.map((feature) => (
                <div
                  key={feature._id}
                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    formData.features.includes(feature._id)
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  } pointer-events-auto`}
                  onClick={() => handleFeatureToggle(feature._id)}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.features.includes(feature._id)}
                      onChange={() => handleFeatureToggle(feature._id)}
                      className="border-slate-300 flex-shrink-0 pointer-events-auto"
                    />
                    <Label className="text-xs font-medium text-slate-700 cursor-pointer flex-1 truncate">
                      {feature.name}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500">
              <Settings className="w-6 h-6 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium">No features available</p>
              <p className="text-xs">Create some features first in the Feature Management section</p>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-slate-200 pt-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            onClick={onSubmit}
            disabled={submitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-semibold pointer-events-auto"
          >
            {submitting && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
            {isEditing ? "Update Plan" : "Create Plan"}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 border-slate-200 py-2 text-sm font-semibold bg-transparent pointer-events-auto"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
