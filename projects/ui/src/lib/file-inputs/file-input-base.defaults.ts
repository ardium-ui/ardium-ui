import { _formFieldComponentDefaults, _FormFieldComponentDefaults } from '../_internal/form-field-component';

export interface _FileInputBaseDefaults extends _FormFieldComponentDefaults {
  compact: boolean;
  multiple: boolean;
  blockAfterUpload: boolean;
}

export const _fileInputBaseDefaults: _FileInputBaseDefaults = {
  ..._formFieldComponentDefaults,
  compact: false,
  multiple: false,
  blockAfterUpload: false,
};
