import { _ngModelComponentDefaults, _NgModelComponentDefaults } from "../_internal/ngmodel-component";

export interface _FileInputBaseDefaults extends _NgModelComponentDefaults {
  compact: boolean;
  multiple: boolean;
  blockAfterUpload: boolean;
}

export const _fileInputBaseDefaults: _FileInputBaseDefaults = {
  ..._ngModelComponentDefaults,
  compact: false,
  multiple: false,
  blockAfterUpload: false,
};