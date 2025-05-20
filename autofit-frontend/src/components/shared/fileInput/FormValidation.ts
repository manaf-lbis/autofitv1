export type FileRule = {
  file: {
    required: string | false;
    validate: {
      fileRequired: (files: FileList | null) => true | string;
      validFileType: (files: FileList | null) => true | string;
      mime?: (files: FileList | null) => true | string;
      maxSize?: (files: FileList | null) => true | string;
    };
  };
};

export const FileValidation: FileRule = {
  file: {
    required: 'Please upload a file',
    validate: {
      fileRequired: (files: FileList | null) =>
        (files && files.length > 0) || 'File is required',

      validFileType: (files: FileList | null) => {
        if (!files || files.length === 0) return true;
        const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
        return allowed.includes(files[0].type)
          ? true
          : 'Only PDF, JPG, or PNG files are allowed';
      },

      maxSize: (files: FileList | null) => {
        if (!files || files.length === 0) return true;
        const maxMB = 5;
        return files[0].size <= maxMB * 1024 * 1024
          ? true
          : `File must be smaller than ${maxMB}MB`;
      }
    }
  }
};