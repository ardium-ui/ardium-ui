import { InjectionToken, Provider } from '@angular/core';
import { _fileInputBaseDefaults, _FileInputBaseDefaults } from '../file-input-base.defaults';
import { ComponentColor } from './../../types/colors.types';
import { FormElementAppearance, FormElementVariant } from './../../types/theming.types';

export interface ArdFileInputDefaults extends _FileInputBaseDefaults {
  appearance: FormElementAppearance;
  variant: FormElementVariant;
  color: ComponentColor;
  inputAttrs: Record<string, any>;
  placeholder: string;
  clearable: boolean;
  clearButtonTitle: string;
}

const _fileInputDefaults: ArdFileInputDefaults = {
  ..._fileInputBaseDefaults,
  appearance: FormElementAppearance.Outlined,
  variant: FormElementVariant.Rounded,
  color: ComponentColor.Primary,
  inputAttrs: {},
  placeholder: '',
  clearable: false,
  clearButtonTitle: 'Clear',
};

export const ARD_FILE_INPUT_DEFAULTS = new InjectionToken<ArdFileInputDefaults>('ard-file-input-defaults', {
  factory: () => ({
    ..._fileInputDefaults,
  }),
});

export function provideFileInputDefaults(config: Partial<ArdFileInputDefaults>): Provider {
  return { provide: ARD_FILE_INPUT_DEFAULTS, useValue: { ..._fileInputDefaults, ...config } };
}
