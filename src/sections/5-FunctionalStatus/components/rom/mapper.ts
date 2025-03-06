import { ROMData } from './types';

export function mapROMToContext(formData: any): any {
  return {
    rangeOfMotion: {
      cervical: formData.data.rangeOfMotion.cervical,
      thoracolumbar: formData.data.rangeOfMotion.thoracolumbar,
      upperExtremity: formData.data.rangeOfMotion.upperExtremity,
      lowerExtremity: formData.data.rangeOfMotion.lowerExtremity,
      generalNotes: formData.data.rangeOfMotion.generalNotes
    }
  };
}

export function mapContextToROM(contextData: any): any {
  return {
    data: {
      rangeOfMotion: contextData.rangeOfMotion || {
        cervical: {},
        thoracolumbar: {},
        upperExtremity: {},
        lowerExtremity: {},
        generalNotes: ''
      }
    }
  };
}