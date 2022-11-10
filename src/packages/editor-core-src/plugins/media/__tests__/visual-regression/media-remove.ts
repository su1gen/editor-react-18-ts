import {
  PuppeteerPage,
  waitForTooltip,
  waitForNoTooltip,
} from '@atlaskit/visual-regression/helper';
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { waitForMediaToBeLoaded } from '@atlaskit/editor-test-helpers/page-objects/media';
import * as mediaAdf from './__fixtures__/media.adf.json';
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';

async function initEditor(page: PuppeteerPage) {
  await initFullPageEditorWithAdf(
    page,
    mediaAdf,
    Device.LaptopMDPI,
    undefined,
    {
      media: {
        allowMediaSingle: true,
      },
    },
  );

  await waitForMediaToBeLoaded(page);
}

describe('Snapshot Test: remove media', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  describe('when the remove button', () => {
    afterEach(async () => {
      await snapshot(page);
    });
    it('receives focus should highlight an element', async () => {
      await initEditor(page);
      await retryUntilStablePosition(
        page,
        async () => await page.click('[data-testid="media-file-card-view"]'),
        '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"]',
        2000,
      );
      await page.focus('button[aria-label="Remove"]');
      await waitForTooltip(page);
    });
    it('lost focus highlight should disappear', async () => {
      await initEditor(page);
      await retryUntilStablePosition(
        page,
        async () => await page.click('[data-testid="media-file-card-view"]'),
        '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"]',
        2000,
      );
      await page.focus('button[aria-label="Remove"]');
      await page.$eval(
        'button[aria-label="Remove"]',
        (element) => element instanceof HTMLElement && element.blur(),
      );
      await waitForNoTooltip(page);
    });
  });
});
