import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  comment,
  insertMedia,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';

[comment].forEach((editor) => {
  BrowserTestCase(
    `insert-and-delete-mediaGroup.ts: Inserts and deletes media group on ${editor.name}`,
    { skip: [] },
    async (client: Parameters<typeof goToEditorTestingWDExample>[0]) => {
      const page = await goToEditorTestingWDExample(client);
      await mountEditor(page, {
        appearance: editor.appearance,
        media: {
          allowMediaSingle: false,
          allowMediaGroup: true,
        },
      });

      await page.type(editable, 'some text');

      // now we can insert media as necessary
      await insertMedia(page, ['one.jpg', 'one.jpg']);

      // wait for the nodeview to appear
      await page.waitForSelector('.wrapper .image');
      expect(await page.count('.wrapper .image')).toBe(2);

      // TODO: check ADF

      // okay, delete the first
      await page.click('.wrapper .image');
      await page.click('.image [aria-label="delete"]');

      expect(await page.count('.wrapper .image')).toBe(1);

      // TODO: check ADF

      await page.click('.wrapper .image');
      await page.click('.image [aria-label="delete"]');

      expect(await page.count('.wrapper .image')).toBe(0);

      // TODO: check ADF
    },
  );
});
