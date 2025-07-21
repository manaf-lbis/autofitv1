import { useState } from "react"
import { Plus, Edit, Trash2, Settings, Loader2, AlertTriangle } from "lucide-react"
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

import {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useTogglePlanStatusMutation,
  useGetFeaturesQuery,
  useCreateFeatureMutation,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
} from "@/services/adminServices/planApi"

import type { Plan, Feature, CreatePlanRequest } from "@/types/plans"

export default function AdminPlansPage() {
  const { data: plans = [], isLoading: plansLoading } = useGetPlansQuery();
  const { data: features = [], isLoading: featuresLoading } = useGetFeaturesQuery();
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();
  const [togglePlanStatus] = useTogglePlanStatusMutation();
  const [createFeature] = useCreateFeatureMutation();
  const [updateFeature] = useUpdateFeatureMutation();
  const [deleteFeature] = useDeleteFeatureMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [featureToDelete, setFeatureToDelete] = useState<Feature | null>(null);
  const [formData, setFormData] = useState<CreatePlanRequest>({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    features: [],
    isPopular: false,
  });
  const [newFeatureName, setNewFeatureName] = useState("");
  const [editFeatureName, setEditFeatureName] = useState("");
  const [validationError, setValidationError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", originalPrice: "", features: [], isPopular: false });
    setValidationError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return setValidationError("Plan name is required"), false;
    if (!formData.description.trim()) return setValidationError("Description is required"), false;
    if (!formData.price || Number(formData.price) <= 0) return setValidationError("Price must be greater than 0"), false;
    if (formData.features.length === 0) return setValidationError("At least one feature is required"), false;
    setValidationError("");
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      };
      await createPlan(submitData).unwrap();
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      setValidationError(error.data?.error || "Failed to create plan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      originalPrice: plan.originalPrice?.toString() || "",
      features: plan.features,
      isPopular: plan.isPopular,
    });
    setValidationError("");
  };

  const handleUpdate = async () => {
    if (!validateForm() || !editingPlan) return;
    setSubmitting(true);
    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      };
      await updatePlan({ id: editingPlan.id, data: submitData }).unwrap();
      setEditingPlan(null);
      resetForm();
    } catch (error: any) {
      setValidationError(error.data?.error || "Failed to update plan");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeletePlan = async () => {
    if (!planToDelete) return;
    try {
      await deletePlan(planToDelete.id).unwrap();
      setPlanToDelete(null);
    } catch (error) {
      console.error("Failed to delete plan:", error);
    }
  };

  const handleTogglePlanStatus = async (planId: string) => {
    try {
      await togglePlanStatus(planId).unwrap();
    } catch (error) {
      console.error("Failed to toggle plan status:", error);
    }
  };

  const addNewFeature = async () => {
    if (!newFeatureName.trim()) return;
    try {
      await createFeature(newFeatureName).unwrap();
      setNewFeatureName("");
    } catch (error) {
      console.error("Failed to create feature:", error);
    }
  };

  const updateFeatureAction = async () => {
    if (!editingFeature || !editFeatureName.trim()) return;
    try {
      await updateFeature({ id: editingFeature.id, name: editFeatureName }).unwrap();
      setEditingFeature(null);
      setEditFeatureName("");
    } catch (error) {
      console.error("Failed to update feature:", error);
    }
  };

  const confirmDeleteFeature = async () => {
    if (!featureToDelete) return;
    try {
      await deleteFeature(featureToDelete.id).unwrap();
      setFeatureToDelete(null);
    } catch (error) {
      console.error("Failed to delete feature:", error);
    }
  };

  const inheritFeaturesFromPlan = (planId: string) => {
    if (planId === "none") return;
    const selectedPlan = plans.find((p) => p.id === planId);
    if (selectedPlan) {
      const mergedFeatures = [...new Set([...formData.features, ...selectedPlan.features])];
      setFormData({ ...formData, features: mergedFeatures });
      setValidationError("");
    }
  };

  const getFeatureName = (featureId: string): string => {
    return features.find((f) => f.id === featureId)?.name || "Unknown";
  };

  const getPlansUsingFeature = (featureId: string): Plan[] => {
    return plans.filter((plan) => plan.features.includes(featureId));
  };

  if (plansLoading || featuresLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-black">Plans Management</h1>
            <p className="text-gray-600 mt-1">Create and manage service plans</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isFeaturesOpen} onOpenChange={setIsFeaturesOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-300 bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Features
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Manage Features</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Add New Feature</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newFeatureName}
                          onChange={(e) => setNewFeatureName(e.target.value)}
                          placeholder="Feature name"
                          onKeyDown={(e) => e.key === "Enter" && addNewFeature()}
                        />
                        <Button onClick={addNewFeature} disabled={!newFeatureName.trim()}>
                          Add
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>All Features ({features.length})</Label>
                      <div className="border rounded-lg p-4 max-h-64 overflow-y-auto no-scrollbar">
                        {features.map((feature) => {
                          const plansUsing = getPlansUsingFeature(feature.id);
                          return (
                            <div
                              key={feature.id}
                              className="flex items-center justify-between py-2 border-b last:border-b-0"
                            >
                              <div>
                                <div className="font-medium">{feature.name}</div>
                                {plansUsing.length > 0 && (
                                  <div className="text-sm text-gray-500">
                                    Used in: {plansUsing.map((p) => p.name).join(", ")}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingFeature(feature);
                                    setEditFeatureName(feature.name);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setFeatureToDelete(feature)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                        {features.length === 0 && (
                          <div className="text-center py-8 text-gray-500">No features created yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4 mt-6">
                  <Button onClick={() => setIsFeaturesOpen(false)} className="w-full">
                    Done
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Create New Plan</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  <PlanForm
                    formData={formData}
                    setFormData={setFormData}
                    features={features}
                    plans={plans}
                    onSubmit={handleCreate}
                    onCancel={() => {
                      setIsCreateOpen(false);
                      resetForm();
                    }}
                    getFeatureName={getFeatureName}
                    validationError={validationError}
                    submitting={submitting}
                    onInheritFeatures={inheritFeaturesFromPlan}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="border border-gray-200 flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                      {plan.isPopular && <Badge className="bg-blue-100 text-blue-800">Popular</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>
                  <Switch checked={plan.isActive} onCheckedChange={() => handleTogglePlanStatus(plan.id)} />
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">₹{plan.price.toLocaleString()}</span>
                  {plan.originalPrice && plan.originalPrice > plan.price && (
                    <span className="text-sm text-gray-500 line-through">₹{plan.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Features ({plan.features.length})</div>
                  <div className="space-y-1">
                    {plan.features.slice(0, 4).map((featureId) => (
                      <div key={featureId} className="text-sm flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        {getFeatureName(featureId)}
                      </div>
                    ))}
                    {plan.features.length > 4 && (
                      <div className="text-sm text-gray-500">+{plan.features.length - 4} more features</div>
                    )}
                  </div>
                </div>
              </CardContent>
              <div className="border-t border-gray-100 p-4 bg-gray-50/80 sticky bottom-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => setPlanToDelete(plan)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium mb-2">No plans created yet</h3>
            <p className="text-gray-600 mb-4">Create your first service plan</p>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </div>
        )}

        {editingPlan && (
          <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Edit Plan</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <PlanForm
                  formData={formData}
                  setFormData={setFormData}
                  features={features}
                  plans={plans}
                  onSubmit={handleUpdate}
                  onCancel={() => {
                    setEditingPlan(null);
                    resetForm();
                  }}
                  getFeatureName={getFeatureName}
                  validationError={validationError}
                  submitting={submitting}
                  onInheritFeatures={inheritFeaturesFromPlan}
                  isEditing
                  editingPlanId={editingPlan.id}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}

        {editingFeature && (
          <Dialog open={!!editingFeature} onOpenChange={() => setEditingFeature(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Feature</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Feature Name</Label>
                  <Input
                    value={editFeatureName}
                    onChange={(e) => setEditFeatureName(e.target.value)}
                    placeholder="Feature name"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={updateFeatureAction} disabled={!editFeatureName.trim()} className="flex-1">
                    Update
                  </Button>
                  <Button variant="outline" onClick={() => setEditingFeature(null)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <AlertDialog open={!!planToDelete} onOpenChange={() => setPlanToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Delete Plan
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the plan "{planToDelete?.name}"?
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800 font-medium">⚠️ Warning:</p>
                  <p className="text-red-700 text-sm mt-1">
                    This action cannot be undone. All data associated with this plan will be permanently deleted.
                  </p>
                  {planToDelete && (
                    <div className="text-red-700 text-sm mt-2">
                      <p>• Plan: {planToDelete.name}</p>
                      <p>• Price: ₹{planToDelete.price.toLocaleString()}</p>
                      <p>• Features: {planToDelete.features.length} items</p>
                      <p>• Status: {planToDelete.isActive ? "Active" : "Inactive"}</p>
                    </div>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeletePlan} className="bg-red-600 hover:bg-red-700">
                Delete Plan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!featureToDelete} onOpenChange={() => setFeatureToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Delete Feature
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{featureToDelete?.name}"?
                {featureToDelete && getPlansUsingFeature(featureToDelete.id).length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-800 font-medium">Warning:</p>
                    <p className="text-red-700 text-sm">
                      This feature is used in {getPlansUsingFeature(featureToDelete.id).length} plan(s). Deleting will
                      remove it from all plans.
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteFeature} className="bg-red-600 hover:bg-red-700">
                Delete Feature
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

interface PlanFormProps {
  formData: CreatePlanRequest;
  setFormData: (data: CreatePlanRequest) => void;
  features: Feature[];
  plans: Plan[];
  onSubmit: () => void;
  onCancel: () => void;
  getFeatureName: (featureId: string) => string;
  validationError: string;
  submitting: boolean;
  onInheritFeatures: (planId: string) => void;
  isEditing?: boolean;
  editingPlanId?: string;
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
  isEditing,
  editingPlanId,
}: PlanFormProps) {
  const handleFeatureToggle = (featureId: string) => {
    const newFeatures = formData.features.includes(featureId)
      ? formData.features.filter((id) => id !== featureId)
      : [...formData.features, featureId];
    setFormData({ ...formData, features: newFeatures });
  };

  const availablePlansForInheritance = plans.filter((plan) => plan.id !== editingPlanId);

  return (
    <div className="space-y-6">
      {validationError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription className="text-red-800">{validationError}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Plan Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Premium"
          />
        </div>
        <div className="space-y-2">
          <Label>Price (₹) *</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Original Price (₹)</Label>
          <Input
            type="number"
            value={formData.originalPrice}
            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
            placeholder="Optional"
          />
        </div>
        <div className="flex items-center space-x-2 pt-7">
          <Checkbox
            checked={formData.isPopular}
            onCheckedChange={(checked) => setFormData({ ...formData, isPopular: !!checked })}
          />
          <Label>Popular Plan</Label>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description *</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description"
          rows={2}
        />
      </div>
      {availablePlansForInheritance.length > 0 && (
        <div className="space-y-2">
          <Label>Inherit Features from Plan</Label>
          <Select onValueChange={onInheritFeatures}>
            <SelectTrigger>
              <SelectValue placeholder="Select plan to copy features" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {availablePlansForInheritance.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name} ({plan.features.length} features)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label>Features * ({formData.features.length} selected)</Label>
        <div className="border rounded-lg p-3 max-h-48 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.features.includes(feature.id)}
                  onCheckedChange={() => handleFeatureToggle(feature.id)}
                />
                <Label className="text-sm">{feature.name}</Label>
              </div>
            ))}
          </div>
          {features.length === 0 && (
            <div className="text-center py-4 text-gray-500">No features available. Create features first.</div>
          )}
        </div>
      </div>
      <div className="border-t pt-4 mt-6">
        <div className="flex gap-3">
          <Button onClick={onSubmit} disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? "Update" : "Create"} Plan
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={submitting} className="flex-1 bg-transparent">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}


// import { useState, useEffect } from "react"
// import { Plus, Edit, Trash2, Settings, Loader2, AlertTriangle } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Switch } from "@/components/ui/switch"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { plansApi, featuresApi } from "@/services/plansApi"
// import type { Plan, Feature, CreatePlanRequest } from "@/types/plans"

// export default function AdminPlansPage() {
//   const [plans, setPlans] = useState<Plan[]>([])
//   const [features, setFeatures] = useState<Feature[]>([])
//   const [loading, setLoading] = useState(true)
//   const [isCreateOpen, setIsCreateOpen] = useState(false)
//   const [isFeaturesOpen, setIsFeaturesOpen] = useState(false)
//   const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
//   const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
//   const [planToDelete, setPlanToDelete] = useState<Plan | null>(null)
//   const [featureToDelete, setFeatureToDelete] = useState<Feature | null>(null)
//   const [formData, setFormData] = useState<CreatePlanRequest>({
//     name: "",
//     description: "",
//     price: "",
//     originalPrice: "",
//     features: [],
//     isPopular: false,
//   })
//   const [newFeatureName, setNewFeatureName] = useState("")
//   const [editFeatureName, setEditFeatureName] = useState("")
//   const [validationError, setValidationError] = useState("")
//   const [submitting, setSubmitting] = useState(false)

//   useEffect(() => {
//     loadData()
//   }, [])

//   const loadData = async () => {
//     setLoading(true)
//     try {
//       const [plansResponse, featuresResponse] = await Promise.all([plansApi.getPlans(), featuresApi.getFeatures()])
//       if (plansResponse.success && plansResponse.data) setPlans(plansResponse.data)
//       if (featuresResponse.success && featuresResponse.data) setFeatures(featuresResponse.data)
//     } catch (error) {
//       console.error("Failed to load data:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const resetForm = () => {
//     setFormData({ name: "", description: "", price: "", originalPrice: "", features: [], isPopular: false })
//     setValidationError("")
//   }

//   const validateForm = () => {
//     if (!formData.name.trim()) return setValidationError("Plan name is required"), false
//     if (!formData.description.trim()) return setValidationError("Description is required"), false
//     if (!formData.price || Number(formData.price) <= 0) return setValidationError("Price must be greater than 0"), false
//     if (formData.features.length === 0) return setValidationError("At least one feature is required"), false
//     setValidationError("")
//     return true
//   }

//   const handleCreate = async () => {
//     if (!validateForm()) return
//     setSubmitting(true)
//     try {
//       const submitData = {
//         ...formData,
//         price: Number(formData.price),
//         originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
//       }
//       const response = await plansApi.createPlan(submitData)
//       if (response.success && response.data) {
//         setPlans([...plans, response.data])
//         setIsCreateOpen(false)
//         resetForm()
//       } else {
//         setValidationError(response.error || "Failed to create plan")
//       }
//     } catch  {
//       setValidationError("Network error. Please try again.")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleEdit = (plan: Plan) => {
//     setEditingPlan(plan)
//     setFormData({
//       name: plan.name,
//       description: plan.description,
//       price: plan.price.toString(),
//       originalPrice: plan.originalPrice?.toString() || "",
//       features: plan.features,
//       isPopular: plan.isPopular,
//     })
//     setValidationError("")
//   }

//   const handleUpdate = async () => {
//     if (!validateForm() || !editingPlan) return
//     setSubmitting(true)
//     try {
//       const submitData = {
//         ...formData,
//         price: Number(formData.price),
//         originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
//       }
//       const response = await plansApi.updatePlan(editingPlan.id, submitData)
//       if (response.success && response.data) {
//         setPlans(plans.map((p) => (p.id === editingPlan.id ? response.data! : p)))
//         setEditingPlan(null)
//         resetForm()
//       } else {
//         setValidationError(response.error || "Failed to update plan")
//       }
//     } catch {
//       setValidationError("Network error. Please try again.")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const confirmDeletePlan = async () => {
//     if (!planToDelete) return
//     try {
//       const response = await plansApi.deletePlan(planToDelete.id)
//       if (response.success) {
//         setPlans(plans.filter((p) => p.id !== planToDelete.id))
//         setPlanToDelete(null)
//       }
//     } catch (error) {
//       console.error("Failed to delete plan:", error)
//     }
//   }

//   const togglePlanStatus = async (planId: string) => {
//     try {
//       const response = await plansApi.togglePlanStatus(planId)
//       if (response.success && response.data) {
//         setPlans(plans.map((p) => (p.id === planId ? response.data! : p)))
//       }
//     } catch (error) {
//       console.error("Failed to toggle plan status:", error)
//     }
//   }

//   const addNewFeature = async () => {
//     if (!newFeatureName.trim()) return
//     try {
//       const response = await featuresApi.createFeature(newFeatureName)
//       if (response.success && response.data) {
//         setFeatures([...features, response.data])
//         setNewFeatureName("")
//       }
//     } catch (error) {
//       console.error("Failed to create feature:", error)
//     }
//   }

//   const updateFeature = async () => {
//     if (!editingFeature || !editFeatureName.trim()) return
//     try {
//       const response = await featuresApi.updateFeature(editingFeature.id, editFeatureName)
//       if (response.success && response.data) {
//         setFeatures(features.map((f) => (f.id === editingFeature.id ? response.data! : f)))
//         setEditingFeature(null)
//         setEditFeatureName("")
//       }
//     } catch (error) {
//       console.error("Failed to update feature:", error)
//     }
//   }

//   const confirmDeleteFeature = async () => {
//     if (!featureToDelete) return
//     try {
//       const response = await featuresApi.deleteFeature(featureToDelete.id)
//       if (response.success) {
//         setFeatures(features.filter((f) => f.id !== featureToDelete.id))
//         loadData()
//         setFeatureToDelete(null)
//       }
//     } catch (error) {
//       console.error("Failed to delete feature:", error)
//     }
//   }

//   const inheritFeaturesFromPlan = (planId: string) => {
//     if (planId === "none") return
//     const selectedPlan = plans.find((p) => p.id === planId)
//     if (selectedPlan) {
//       const mergedFeatures = [...new Set([...formData.features, ...selectedPlan.features])]
//       setFormData({ ...formData, features: mergedFeatures })
//       setValidationError("")
//     }
//   }

//   const getFeatureName = (featureId: string): string => {
//     return features.find((f) => f.id === featureId)?.name || "Unknown"
//   }

//   const getPlansUsingFeature = (featureId: string): Plan[] => {
//     return plans.filter((plan) => plan.features.includes(featureId))
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
//           <p className="text-gray-600">Loading plans...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-black">Plans Management</h1>
//             <p className="text-gray-600 mt-1">Create and manage service plans</p>
//           </div>
//           <div className="flex gap-3">
//             <Dialog open={isFeaturesOpen} onOpenChange={setIsFeaturesOpen}>
//               <DialogTrigger asChild>
//                 <Button variant="outline" className="border-gray-300 bg-transparent">
//                   <Settings className="w-4 h-4 mr-2" />
//                   Features
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
//                 <DialogHeader>
//                   <DialogTitle>Manage Features</DialogTitle>
//                 </DialogHeader>
//                 <div className="flex-1 overflow-y-auto no-scrollbar">
//                   <div className="space-y-6">
//                     <div className="space-y-2">
//                       <Label>Add New Feature</Label>
//                       <div className="flex gap-2">
//                         <Input
//                           value={newFeatureName}
//                           onChange={(e) => setNewFeatureName(e.target.value)}
//                           placeholder="Feature name"
//                           onKeyDown={(e) => e.key === "Enter" && addNewFeature()}
//                         />
//                         <Button onClick={addNewFeature} disabled={!newFeatureName.trim()}>
//                           Add
//                         </Button>
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <Label>All Features ({features.length})</Label>
//                       <div className="border rounded-lg p-4 max-h-64 overflow-y-auto no-scrollbar">
//                         {features.map((feature) => {
//                           const plansUsing = getPlansUsingFeature(feature.id)
//                           return (
//                             <div
//                               key={feature.id}
//                               className="flex items-center justify-between py-2 border-b last:border-b-0"
//                             >
//                               <div>
//                                 <div className="font-medium">{feature.name}</div>
//                                 {plansUsing.length > 0 && (
//                                   <div className="text-sm text-gray-500">
//                                     Used in: {plansUsing.map((p) => p.name).join(", ")}
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="flex gap-2">
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() => {
//                                     setEditingFeature(feature)
//                                     setEditFeatureName(feature.name)
//                                   }}
//                                 >
//                                   <Edit className="w-4 h-4" />
//                                 </Button>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() => setFeatureToDelete(feature)}
//                                   className="text-red-600 hover:text-red-700"
//                                 >
//                                   <Trash2 className="w-4 h-4" />
//                                 </Button>
//                               </div>
//                             </div>
//                           )
//                         })}
//                         {features.length === 0 && (
//                           <div className="text-center py-8 text-gray-500">No features created yet</div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="border-t pt-4 mt-6">
//                   <Button onClick={() => setIsFeaturesOpen(false)} className="w-full">
//                     Done
//                   </Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//             <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
//               <DialogTrigger asChild>
//                 <Button className="bg-blue-600 hover:bg-blue-700">
//                   <Plus className="w-4 h-4 mr-2" />
//                   Create Plan
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
//                 <DialogHeader>
//                   <DialogTitle>Create New Plan</DialogTitle>
//                 </DialogHeader>
//                 <div className="flex-1 overflow-y-auto no-scrollbar">
//                   <PlanForm
//                     formData={formData}
//                     setFormData={setFormData}
//                     features={features}
//                     plans={plans}
//                     onSubmit={handleCreate}
//                     onCancel={() => {
//                       setIsCreateOpen(false)
//                       resetForm()
//                     }}
//                     getFeatureName={getFeatureName}
//                     validationError={validationError}
//                     submitting={submitting}
//                     onInheritFeatures={inheritFeaturesFromPlan}
//                   />
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>

//         {/* Plans Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {plans.map((plan) => (
//             <Card key={plan.id} className="border border-gray-200 flex flex-col">
//               <CardHeader className="pb-4">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <div className="flex items-center gap-2 mb-1">
//                       <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
//                       {plan.isPopular && <Badge className="bg-blue-100 text-blue-800">Popular</Badge>}
//                     </div>
//                     <p className="text-sm text-gray-600">{plan.description}</p>
//                   </div>
//                   <Switch checked={plan.isActive} onCheckedChange={() => togglePlanStatus(plan.id)} />
//                 </div>
//               </CardHeader>
//               <CardContent className="flex-1 space-y-4">
//                 <div className="flex items-baseline gap-2">
//                   <span className="text-2xl font-bold">₹{plan.price.toLocaleString()}</span>
//                   {plan.originalPrice && plan.originalPrice > plan.price && (
//                     <span className="text-sm text-gray-500 line-through">₹{plan.originalPrice.toLocaleString()}</span>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <div className="text-sm font-medium">Features ({plan.features.length})</div>
//                   <div className="space-y-1">
//                     {plan.features.slice(0, 4).map((featureId) => (
//                       <div key={featureId} className="text-sm flex items-center gap-2">
//                         <div className="w-1 h-1 bg-gray-400 rounded-full" />
//                         {getFeatureName(featureId)}
//                       </div>
//                     ))}
//                     {plan.features.length > 4 && (
//                       <div className="text-sm text-gray-500">+{plan.features.length - 4} more features</div>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//               <div className="border-t border-gray-100 p-4 bg-gray-50/80 sticky bottom-0">
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex-1 bg-transparent"
//                     onClick={() => handleEdit(plan)}
//                   >
//                     <Edit className="w-4 h-4 mr-1" />
//                     Edit
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex-1 text-red-600 hover:text-red-700"
//                     onClick={() => setPlanToDelete(plan)}
//                   >
//                     <Trash2 className="w-4 h-4 mr-1" />
//                     Delete
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>

//         {plans.length === 0 && (
//           <div className="text-center py-16">
//             <h3 className="text-lg font-medium mb-2">No plans created yet</h3>
//             <p className="text-gray-600 mb-4">Create your first service plan</p>
//             <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
//               <Plus className="w-4 h-4 mr-2" />
//               Create Plan
//             </Button>
//           </div>
//         )}

//         {/* Edit Plan Dialog */}
//         {editingPlan && (
//           <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
//             <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
//               <DialogHeader>
//                 <DialogTitle>Edit Plan</DialogTitle>
//               </DialogHeader>
//               <div className="flex-1 overflow-y-auto no-scrollbar">
//                 <PlanForm
//                   formData={formData}
//                   setFormData={setFormData}
//                   features={features}
//                   plans={plans}
//                   onSubmit={handleUpdate}
//                   onCancel={() => {
//                     setEditingPlan(null)
//                     resetForm()
//                   }}
//                   getFeatureName={getFeatureName}
//                   validationError={validationError}
//                   submitting={submitting}
//                   onInheritFeatures={inheritFeaturesFromPlan}
//                   isEditing
//                   editingPlanId={editingPlan.id}
//                 />
//               </div>
//             </DialogContent>
//           </Dialog>
//         )}

//         {/* Edit Feature Dialog */}
//         {editingFeature && (
//           <Dialog open={!!editingFeature} onOpenChange={() => setEditingFeature(null)}>
//             <DialogContent className="max-w-md">
//               <DialogHeader>
//                 <DialogTitle>Edit Feature</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label>Feature Name</Label>
//                   <Input
//                     value={editFeatureName}
//                     onChange={(e) => setEditFeatureName(e.target.value)}
//                     placeholder="Feature name"
//                   />
//                 </div>
//                 <div className="flex gap-2">
//                   <Button onClick={updateFeature} disabled={!editFeatureName.trim()} className="flex-1">
//                     Update
//                   </Button>
//                   <Button variant="outline" onClick={() => setEditingFeature(null)} className="flex-1">
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>
//         )}

//         {/* Delete Plan Confirmation */}
//         <AlertDialog open={!!planToDelete} onOpenChange={() => setPlanToDelete(null)}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle className="flex items-center gap-2">
//                 <AlertTriangle className="w-5 h-5 text-red-600" />
//                 Delete Plan
//               </AlertDialogTitle>
//               <AlertDialogDescription>
//                 Are you sure you want to delete the plan "{planToDelete?.name}"?
//                 <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
//                   <p className="text-red-800 font-medium">⚠️ Warning:</p>
//                   <p className="text-red-700 text-sm mt-1">
//                     This action cannot be undone. All data associated with this plan will be permanently deleted.
//                   </p>
//                   {planToDelete && (
//                     <div className="text-red-700 text-sm mt-2">
//                       <p>• Plan: {planToDelete.name}</p>
//                       <p>• Price: ₹{planToDelete.price.toLocaleString()}</p>
//                       <p>• Features: {planToDelete.features.length} items</p>
//                       <p>• Status: {planToDelete.isActive ? "Active" : "Inactive"}</p>
//                     </div>
//                   )}
//                 </div>
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction onClick={confirmDeletePlan} className="bg-red-600 hover:bg-red-700">
//                 Delete Plan
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>

//         {/* Delete Feature Confirmation */}
//         <AlertDialog open={!!featureToDelete} onOpenChange={() => setFeatureToDelete(null)}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle className="flex items-center gap-2">
//                 <AlertTriangle className="w-5 h-5 text-red-600" />
//                 Delete Feature
//               </AlertDialogTitle>
//               <AlertDialogDescription>
//                 Are you sure you want to delete "{featureToDelete?.name}"?
//                 {featureToDelete && getPlansUsingFeature(featureToDelete.id).length > 0 && (
//                   <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
//                     <p className="text-red-800 font-medium">Warning:</p>
//                     <p className="text-red-700 text-sm">
//                       This feature is used in {getPlansUsingFeature(featureToDelete.id).length} plan(s). Deleting will
//                       remove it from all plans.
//                     </p>
//                   </div>
//                 )}
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction onClick={confirmDeleteFeature} className="bg-red-600 hover:bg-red-700">
//                 Delete Feature
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>

//       <style>{`
//         .no-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .no-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   )
// }

// interface PlanFormProps {
//   formData: CreatePlanRequest
//   setFormData: (data: CreatePlanRequest) => void
//   features: Feature[]
//   plans: Plan[]
//   onSubmit: () => void
//   onCancel: () => void
//   getFeatureName: (featureId: string) => string
//   validationError: string
//   submitting: boolean
//   onInheritFeatures: (planId: string) => void
//   isEditing?: boolean
//   editingPlanId?: string
// }

// function PlanForm({
//   formData,
//   setFormData,
//   features,
//   plans,
//   onSubmit,
//   onCancel,
//   validationError,
//   submitting,
//   onInheritFeatures,
//   isEditing,
//   editingPlanId,
// }: PlanFormProps) {
//   const handleFeatureToggle = (featureId: string) => {
//     const newFeatures = formData.features.includes(featureId)
//       ? formData.features.filter((id) => id !== featureId)
//       : [...formData.features, featureId]
//     setFormData({ ...formData, features: newFeatures })
//   }

//   const availablePlansForInheritance = plans.filter((plan) => plan.id !== editingPlanId)

//   return (
//     <div className="space-y-6">
//       {validationError && (
//         <Alert className="border-red-200 bg-red-50">
//           <AlertTriangle className="w-4 h-4" />
//           <AlertDescription className="text-red-800">{validationError}</AlertDescription>
//         </Alert>
//       )}
//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label>Plan Name *</Label>
//           <Input
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             placeholder="e.g., Premium"
//           />
//         </div>
//         <div className="space-y-2">
//           <Label>Price (₹) *</Label>
//           <Input
//             type="number"
//             value={formData.price}
//             onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//             placeholder="0"
//           />
//         </div>
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label>Original Price (₹)</Label>
//           <Input
//             type="number"
//             value={formData.originalPrice}
//             onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
//             placeholder="Optional"
//           />
//         </div>
//         <div className="flex items-center space-x-2 pt-7">
//           <Checkbox
//             checked={formData.isPopular}
//             onCheckedChange={(checked) => setFormData({ ...formData, isPopular: !!checked })}
//           />
//           <Label>Popular Plan</Label>
//         </div>
//       </div>
//       <div className="space-y-2">
//         <Label>Description *</Label>
//         <Textarea
//           value={formData.description}
//           onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//           placeholder="Brief description"
//           rows={2}
//         />
//       </div>
//       {availablePlansForInheritance.length > 0 && (
//         <div className="space-y-2">
//           <Label>Inherit Features from Plan</Label>
//           <Select onValueChange={onInheritFeatures}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select plan to copy features" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="none">None</SelectItem>
//               {availablePlansForInheritance.map((plan) => (
//                 <SelectItem key={plan.id} value={plan.id}>
//                   {plan.name} ({plan.features.length} features)
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       )}
//       <div className="space-y-2">
//         <Label>Features * ({formData.features.length} selected)</Label>
//         <div className="border rounded-lg p-3 max-h-48 overflow-y-auto no-scrollbar">
//           <div className="grid grid-cols-2 gap-2">
//             {features.map((feature) => (
//               <div key={feature.id} className="flex items-center space-x-2">
//                 <Checkbox
//                   checked={formData.features.includes(feature.id)}
//                   onCheckedChange={() => handleFeatureToggle(feature.id)}
//                 />
//                 <Label className="text-sm">{feature.name}</Label>
//               </div>
//             ))}
//           </div>
//           {features.length === 0 && (
//             <div className="text-center py-4 text-gray-500">No features available. Create features first.</div>
//           )}
//         </div>
//       </div>
//       <div className="border-t pt-4 mt-6">
//         <div className="flex gap-3">
//           <Button onClick={onSubmit} disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
//             {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//             {isEditing ? "Update" : "Create"} Plan
//           </Button>
//           <Button variant="outline" onClick={onCancel} disabled={submitting} className="flex-1 bg-transparent">
//             Cancel
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }