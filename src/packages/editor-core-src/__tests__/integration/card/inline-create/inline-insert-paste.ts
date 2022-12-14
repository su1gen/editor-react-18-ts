import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  editable,
  copyToClipboard,
  gotoEditor,
} from '@atlaskit/editor-test-helpers/integration/helpers';

BrowserTestCase(
  `card: pasting an link converts to inline card`,
  {
    skip: ['safari'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    // Copy stuff to clipboard
    await copyToClipboard(page, 'https://www.atlassian.com');

    await gotoEditor(page);

    // Type some text into the paragraph first
    await page.type(editable, 'hello have a link ');

    // Paste the link
    await page.paste();

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// See packages/editor/editor-core/src/__tests__/integration/paste/links.ts for more tests for
// plain text pasting.
