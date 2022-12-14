import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import * as embedCardAdf from './_fixtures_/embed-card.adf.json';
import { waitForEmbedCardSelection } from '@atlaskit/media-integration-test-helpers';
import { linkPickerSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

BrowserTestCase(
  'card: changing the link URL of an embed link to an unsupported url should convert it to a "dumb" link',
  {
    skip: ['safari'],
  },
  async (client: ClientType, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const cardProviderPromise = Promise.resolve(
      new ConfluenceCardProvider('prod'),
    );

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(embedCardAdf),
      smartLinks: {
        provider: cardProviderPromise,
        allowBlockCards: true,
        allowEmbeds: true,
      },
    });

    await waitForEmbedCardSelection(page);

    const editLinkButtonSelector = 'button[aria-label="Edit link"]';
    await page.waitForSelector(editLinkButtonSelector);
    await page.click(editLinkButtonSelector);

    // Clear the Link Label field before typing
    const linkUrlSelector = '[data-testid="link-url"]';
    await page.waitForSelector(linkUrlSelector);
    await page.clear(linkUrlSelector);

    // Change the 'link address' field to another link and press enter
    await page.type(linkUrlSelector, [
      'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
      'Return',
    ]);

    expect(
      await page.$eval(editable, getDocFromElement),
    ).toMatchCustomDocSnapshot(testName);
  },
);

describe('with feature flag: lp-link-picker', () => {
  BrowserTestCase(
    'card: changing the link URL of an embed link to an unsupported url should convert it to a "dumb" link',
    {
      skip: ['safari'],
    },
    async (client: ClientType, testName: string) => {
      const page = await goToEditorTestingWDExample(client);

      const cardProviderPromise = Promise.resolve(
        new ConfluenceCardProvider('prod'),
      );

      await mountEditor(
        page,
        {
          appearance: fullpage.appearance,
          allowTextAlignment: true,
          defaultValue: JSON.stringify(embedCardAdf),
          smartLinks: {
            provider: cardProviderPromise,
            allowBlockCards: true,
            allowEmbeds: true,
          },
          featureFlags: {
            'lp-link-picker': true,
          },
        },
        {
          withLinkPickerOptions: true,
        },
      );

      await waitForEmbedCardSelection(page);

      const editLinkButtonSelector = 'button[aria-label="Edit link"]';
      await page.waitForSelector(editLinkButtonSelector);
      await page.click(editLinkButtonSelector);

      // Clear the Link Label field before typing
      await page.waitForSelector(linkPickerSelectors.linkInput);
      await page.clear(linkPickerSelectors.linkInput);

      // Change the 'link address' field to another link and press enter
      await page.type(linkPickerSelectors.linkInput, [
        'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
        'Return',
      ]);

      expect(
        await page.$eval(editable, getDocFromElement),
      ).toMatchCustomDocSnapshot(testName);
    },
  );
});
