import { InjectionToken, Provider } from '@angular/core';
import { _FileInputBaseDefaults, _fileInputBaseDefaults } from '../file-input-base.defaults';
import { ComponentColor } from './../../types/colors.types';
import { FormElementVariant } from './../../types/theming.types';

export interface ArdFileDropAreaDefaults extends _FileInputBaseDefaults {
  variant: FormElementVariant;
  color: ComponentColor;
}

const _fileDropAreaDefaults: ArdFileDropAreaDefaults = {
  ..._fileInputBaseDefaults,
  variant: FormElementVariant.Rounded,
  color: ComponentColor.Primary,
};

export const ARD_FILE_DROP_AREA_DEFAULTS = new InjectionToken<ArdFileDropAreaDefaults>('ard-file-drop-area-defaults', {
  factory: () => ({
    ..._fileDropAreaDefaults,
  }),
});

export function provideFileDropAreaDefaults(config: Partial<ArdFileDropAreaDefaults>): Provider {
  return { provide: ARD_FILE_DROP_AREA_DEFAULTS, useValue: { ..._fileDropAreaDefaults, ...config } };
}
