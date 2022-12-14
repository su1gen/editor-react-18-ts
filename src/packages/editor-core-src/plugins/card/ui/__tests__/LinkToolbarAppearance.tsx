jest.mock('../../pm-plugins/doc', () => {
  const doc = jest.requireActual('../../pm-plugins/doc');
  return {
    ...doc,
    changeSelectedCardToLink: jest.fn().mockReturnValue(() => () => {}),
  };
});
jest.mock('../../../../utils/nodes', () => ({
  ...jest.requireActual<Object>('../../../../utils/nodes'),
  isSupportedInParent: jest.fn(),
}));
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { fakeIntl, asMock } from '@atlaskit/media-test-helpers';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { EditorState } from 'prosemirror-state';
import {
  LinkToolbarAppearance,
  LinkToolbarAppearanceProps,
} from '../LinkToolbarAppearance';
import Dropdown from '../../../floating-toolbar/ui/Dropdown';
import {
  doc,
  p,
  inlineCard,
  blockCard,
  panel as panelNode,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { pluginKey } from '../../pm-plugins/main';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { changeSelectedCardToLink } from '../../pm-plugins/doc';
import { isSupportedInParent } from '../../../../utils/nodes';
import * as featureFlags from '../../../../plugins/feature-flags-context';
import { LinkToolbarButtonGroup } from '../LinkToolbarButtonGroup';
import { LinkToolbarIconDropdown } from '../LinkToolbarIconDropdown';

describe('LinkToolbarAppearance', () => {
  const featureFlagSpy = jest.spyOn(featureFlags, 'getFeatureFlags');

  beforeEach(() => {
    featureFlagSpy.mockReturnValue({
      viewChangingExperimentToolbarStyle: undefined,
    });
  });

  afterEach(() => {
    featureFlagSpy.mockReset();
  });

  afterAll(() => {
    featureFlagSpy.mockRestore();
  });

  const createEditor = createEditorFactory();
  const providerFactory = new ProviderFactory();
  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      providerFactory,
      editorProps: {
        allowPanel: true,
        smartLinks: {
          allowEmbeds: true,
        },
      },
      pluginKey,
    });
  };
  const getDropdownOptions = (toolbar: ShallowWrapper) => {
    const dropdown = toolbar.find(Dropdown);
    const options = (dropdown.prop('options') as unknown) as {
      testId: string;
      onClick: (state: EditorState, dispath: Function) => void;
      selected: boolean;
    }[];

    return options;
  };

  it('should render default options', () => {
    const editorState = EditorState.create({ schema: defaultSchema });
    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="block"
        editorState={editorState}
        url="some-url"
      />,
    );
    const dropdown = toolbar.find(Dropdown);

    expect(dropdown).toHaveLength(1);
    expect(dropdown.prop('options')).toEqual([
      expect.objectContaining({ testId: 'url-appearance' }),
      expect.objectContaining({ testId: 'inline-appearance' }),
      expect.objectContaining({ testId: 'block-appearance' }),
    ]);
  });

  it('should render embed option when available', () => {
    const editorState = EditorState.create({ schema: defaultSchema });
    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="block"
        editorState={editorState}
        url="some-url"
        allowEmbeds
        platform="web"
      />,
    );
    const getPreview = jest.fn().mockReturnValue('some-url-preview');
    const context = {
      contextAdapter: {
        card: {
          value: {
            extractors: { getPreview },
          },
        },
      },
    };

    toolbar.instance().context = context;

    // Force a re-render
    toolbar.setProps({});
    toolbar.update();

    expect(getPreview).toBeCalledWith('some-url', 'web');
    const dropdown = toolbar.find(Dropdown);
    expect(dropdown).toHaveLength(1);
    expect(dropdown.prop('options')).toEqual([
      expect.objectContaining({ testId: 'url-appearance' }),
      expect.objectContaining({ testId: 'inline-appearance' }),
      expect.objectContaining({ testId: 'block-appearance' }),
      expect.objectContaining({ testId: 'embed-appearance' }),
    ]);
  });

  it('should not render embed option by default', () => {
    const editorState = EditorState.create({ schema: defaultSchema });
    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="block"
        editorState={editorState}
        url="some-url"
      />,
    );
    const getPreview = jest.fn();
    const context = {
      contextAdapter: {
        card: {
          value: {
            extractors: { getPreview },
          },
        },
      },
    };

    toolbar.instance().context = context;

    // Force a re-render
    toolbar.setProps({});
    toolbar.update();

    expect(getPreview).not.toBeCalled();
    const dropdown = toolbar.find(Dropdown);
    expect(dropdown).toHaveLength(1);
    expect(dropdown.prop('options')).toEqual([
      expect.objectContaining({ testId: 'url-appearance' }),
      expect.objectContaining({ testId: 'inline-appearance' }),
      expect.objectContaining({ testId: 'block-appearance' }),
    ]);
  });

  it('should render selected option', () => {
    const editorState = EditorState.create({ schema: defaultSchema });
    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="block"
        editorState={editorState}
        url="some-url"
      />,
    );

    expect(toolbar.find(Dropdown).prop('options')).toContainEqual(
      expect.objectContaining({
        testId: 'block-appearance',
        selected: true,
      }),
    );

    toolbar.setProps({
      currentAppearance: 'inline',
    });

    expect(toolbar.find(Dropdown).prop('options')).toContainEqual(
      expect.objectContaining({
        testId: 'inline-appearance',
        selected: true,
      }),
    );
  });

  it('it switches appearance on dropdown option click', () => {
    const { editorView } = editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url: 'http://www.atlassian.com/',
          })(),
        ),
      ),
    );

    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="inline"
        editorState={editorView.state}
        url="some-url"
      />,
    );
    const options = getDropdownOptions(toolbar);

    options
      .find((option) => option.testId === 'block-appearance')!
      .onClick(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p(),
        blockCard({
          url: 'http://www.atlassian.com/',
        })(),
      ),
    );
  });

  it('switches to block appearance in the existing position on appearance change', () => {
    const { editorView } = editor(
      doc(
        panelNode()(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      ),
    );
    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="inline"
        editorState={editorView.state}
        url="some-url"
      />,
    );
    const options = getDropdownOptions(toolbar);
    options
      .find((option) => option.testId === 'block-appearance')!
      .onClick(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        panelNode()(
          p(),
          blockCard({
            url: 'http://www.atlassian.com/',
          })(),
        ),
      ),
    );
  });

  it('should switch smart card into link when clicking on "Display URL"', () => {
    const { editorView } = editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url: 'http://www.atlassian.com/',
          })(),
        ),
      ),
    );

    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="inline"
        editorState={editorView.state}
        url="some-url"
      />,
    );
    const options = getDropdownOptions(toolbar);
    options
      .find((option) => option.testId === 'url-appearance')!
      .onClick(editorView.state, editorView.dispatch);

    expect(changeSelectedCardToLink).toBeCalledTimes(1);
    expect(changeSelectedCardToLink).toBeCalledWith(
      'some-url',
      'some-url',
      true,
    );
  });

  it('should render URL appearance as selected if no currentAppearance is provided', () => {
    const { editorView } = editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url: 'http://www.atlassian.com/',
          })(),
        ),
      ),
    );

    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        editorState={editorView.state}
        url="some-url"
      />,
    );
    const options = getDropdownOptions(toolbar);
    const urlAppearance = options.find(
      (option) => option.testId === 'url-appearance',
    );
    expect(urlAppearance!.selected).toBeTruthy();
  });

  it('should return null when url has fatal errored', () => {
    const editorState = EditorState.create({ schema: defaultSchema });
    const someUrl = 'some-url';
    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        editorState={editorState}
        url={someUrl}
      />,
    );
    const currentCardState = {
      error: {
        kind: 'fatal',
      },
    };

    const cardStateMap = { [someUrl]: currentCardState };
    const context = {
      contextAdapter: {
        card: {
          value: {
            store: {
              getState: jest.fn(() => cardStateMap),
              dispatch: jest.fn(),
              subscribe: jest.fn(),
              replaceReducer: jest.fn(),
            },
          },
        },
      },
    };

    toolbar.instance().context = context;

    // Force a re-render
    toolbar.setProps({});
    toolbar.update();

    // Assert that the toolbar is returning null
    expect(toolbar.get(0)).toBeFalsy();
  });

  it('should disable appearance if its not supported in the parent', () => {
    asMock(isSupportedInParent).mockReturnValue(false);
    const editorState = EditorState.create({ schema: defaultSchema });
    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="block"
        editorState={editorState}
        url="some-url"
        allowEmbeds
        platform="web"
      />,
    );
    const getPreview = jest.fn().mockReturnValue('some-url-preview');
    const context = {
      contextAdapter: {
        card: {
          value: {
            extractors: { getPreview },
          },
        },
      },
    };

    toolbar.instance().context = context;

    // Force a re-render
    toolbar.setProps({});
    toolbar.update();

    const dropdown = toolbar.find(Dropdown);
    expect(dropdown).toHaveLength(1);
    expect(dropdown.prop('options')).toEqual([
      expect.objectContaining({ testId: 'url-appearance' }),
      expect.objectContaining({ testId: 'inline-appearance' }),
      expect.objectContaining({ testId: 'block-appearance', disabled: true }),
      expect.objectContaining({ testId: 'embed-appearance', disabled: true }),
    ]);
  });

  it('returns a component with a `dispatchCommand` prop that can dispatch commands with the editor state and dispatch', () => {
    const { editorView } = editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url: 'http://www.atlassian.com/',
          })(),
        ),
      ),
    );

    const toolbar = shallow(
      <LinkToolbarAppearance
        intl={fakeIntl}
        currentAppearance="block"
        editorState={editorView.state}
        editorView={editorView}
        url="some-url"
      />,
    );

    const { dispatchCommand } = toolbar.find(Dropdown).props();
    const fn = jest.fn();

    dispatchCommand(fn);
    expect(fn).toHaveBeenCalledWith(editorView.state, editorView.dispatch);
  });

  describe('LinkToolbarAppearance when featureflag is `newDropdown`', () => {
    beforeEach(() => {
      featureFlagSpy.mockReturnValue({
        viewChangingExperimentToolbarStyle: 'newDropdown',
      });
    });

    it('should render a LinkToolbarIconDropdown if featureflag is `newDropdown`', () => {
      const editorState = EditorState.create({ schema: defaultSchema });
      const toolbar = shallow(
        <LinkToolbarAppearance
          intl={fakeIntl}
          currentAppearance="block"
          editorState={editorState}
          url="some-url"
        />,
      );
      const dropdown = toolbar.find(Dropdown);
      const buttonGroup = toolbar.find(LinkToolbarButtonGroup);
      const iconDropdown = toolbar.find(LinkToolbarIconDropdown);

      expect(dropdown).toHaveLength(0);
      expect(buttonGroup).toHaveLength(0);
      expect(iconDropdown).toHaveLength(1);
    });
  });

  describe('LinkToolbarAppearance when featureflag is `toolbarIcons`', () => {
    beforeEach(() => {
      featureFlagSpy.mockReturnValue({
        viewChangingExperimentToolbarStyle: 'toolbarIcons',
      });
    });

    const setup = (props?: Partial<LinkToolbarAppearanceProps>) => {
      const editorState = EditorState.create({ schema: defaultSchema });
      return shallow(
        <LinkToolbarAppearance
          intl={fakeIntl}
          currentAppearance="block"
          editorState={editorState}
          url="some-url"
          {...props}
        />,
      );
    };

    it('should render a `LinkToolbarButtonGroup`', () => {
      const toolbar = setup();
      const dropdown = toolbar.find(Dropdown);
      const buttonGroup = toolbar.find(LinkToolbarButtonGroup);
      const iconDropdown = toolbar.find(LinkToolbarIconDropdown);

      expect(dropdown).toHaveLength(0);
      expect(buttonGroup).toHaveLength(1);
      expect(iconDropdown).toHaveLength(0);
    });

    it('should render `LinkToolbarButtonGroup` with the required props', () => {
      const toolbar = setup();
      const buttonGroup = toolbar.find(LinkToolbarButtonGroup);

      expect(buttonGroup.prop('options')).toHaveLength(3);
    });

    it('should render default options', () => {
      const toolbar = setup();
      const buttonGroup = toolbar.find(LinkToolbarButtonGroup);

      expect(buttonGroup.prop('options')).toEqual([
        expect.objectContaining({ testId: 'url-appearance' }),
        expect.objectContaining({ testId: 'inline-appearance' }),
        expect.objectContaining({ testId: 'block-appearance' }),
      ]);
    });
  });
});
