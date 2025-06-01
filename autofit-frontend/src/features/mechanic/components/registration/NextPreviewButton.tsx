import React from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


interface Props {
  onPrev(): void;
  onNext(): void;
}

const maxStep = 3; 

const NextPreviewButton: React.FC<Props> = ({ onPrev, onNext }) => {
  const currentStep  = useSelector((state:RootState)=>state.mechRegistration.currentStep)

  return (
    <div className="sticky bottom-0 bg-white py-3 z-10">
      <div className="flex justify-between items-center">
        {currentStep > 0 ? (
          <Button
            variant="outline"
            type="button"
            className="text-[#1c2b30] text-sm font-semibold px-5 py-2.5 rounded-md border border-[#1c2b30] hover:bg-[#1c2b30] hover:text-white transition focus:outline-none focus:ring-1 focus:ring-[#1c2b30]"
            onClick={onPrev}
            aria-label="Go to previous step"
          >
            Previous
          </Button>
        ) : (
          <span className="w-[88px]" /> 
        )}

        <Button
          type="button"
          className="bg-[#1c2b30] text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-[#163036] transition focus:outline-none focus:ring-1 focus:ring-[#1c2b30]"
          onClick={onNext}
          aria-label="Go to next step"
        >
          {currentStep === maxStep ? "Submit" : "Next Step"}
        </Button>
      </div>
    </div>
  );
};

export default NextPreviewButton;