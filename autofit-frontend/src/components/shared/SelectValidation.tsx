export type Rule = {
    brand: object,
    model: object,
    fuelType: object,
}

export const isNotEmptySelect = (fieldName = 'field') => (value: string) =>
    value?.trim() !== '' && value !== 'Select one'
    ? true
    : `Please select a ${fieldName}`;
  

export const FormValidation : Rule = {
    brand: {
        required: 'Brand is required',
        validate: {
          isSelected: isNotEmptySelect('brand')
        }
      },
    
      model: {
        required: 'Model is required',
        validate: {
          isSelected: isNotEmptySelect('model')
        }
      },
    
      fuelType: {
        required: 'Fuel type is required',
        validate: {
          isSelected: isNotEmptySelect('fuel type')
        }
    }
}   
