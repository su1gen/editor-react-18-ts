import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/visual-regression/_getCopyButtonTestSuite';
import fullWidthExtensionADF from '../visual-regression/__fixtures__/full-width-extension-inside-bodied-extension.adf.json';

_getCopyButtonTestSuite({
  nodeName: 'Extension',
  editorOptions: {
    allowExtension: true,
    defaultValue: fullWidthExtensionADF,
  },
  nodeSelector: '.extension-container',
});
