import { pluginKey } from '../../../../plugins/card/pm-plugins/main';
import {
  setProvider,
  queueCards,
  resolveCard,
} from '../../../../plugins/card/pm-plugins/actions';

import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  DocBuilder,
  p,
  inlineCard,
  blockCard,
  Refs,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { setNodeSelection } from '../../../../utils';
import {
  visitCardLink,
  removeCard,
  openLinkSettings,
} from '../../../../plugins/card/toolbar';
import { EditorView } from 'prosemirror-view';
import { createCardRequest } from './_helpers';

const atlassianUrl = 'http://www.atlassian.com/';

describe('card', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: jest.MockInstance<UIAnalyticsEvent, any>;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = createAnalyticsEventMock();
    const wrapper = createEditor({
      doc,
      pluginKey,
      createAnalyticsEvent: createAnalyticsEvent as any,
      editorProps: { allowAnalyticsGASV3: true, smartLinks: {} },
    });
    createAnalyticsEvent.mockClear();
    return wrapper;
  };

  describe('actions', () => {
    describe('setProvider', () => {
      it('sets the card provider', () => {
        const { editorView } = editor(doc(p()));
        const { state, dispatch } = editorView;

        const provider = new EditorTestCardProvider();
        dispatch(setProvider(provider)(state.tr));

        expect(pluginKey.getState(editorView.state)).toEqual({
          cards: [],
          requests: [],
          provider: provider,
          showLinkingToolbar: false,
          events: undefined,
          createAnalyticsEvent,
        });
      });
    });

    describe('queueCard', () => {
      it('queues a url', () => {
        const { editorView } = editor(doc(p()));
        const cardRequest = createCardRequest(atlassianUrl, 24);
        const {
          dispatch,
          state: { tr },
        } = editorView;

        dispatch(queueCards([cardRequest])(tr));

        expect(pluginKey.getState(editorView.state)).toEqual(
          expect.objectContaining({
            requests: [cardRequest],
          }),
        );
      });

      it('can queue the same url with different positions', () => {
        const { editorView } = editor(doc(p()));
        const { dispatch } = editorView;

        const cardRequestOne = createCardRequest(atlassianUrl, 24);
        const cardRequestTwo = createCardRequest(atlassianUrl, 420);

        dispatch(
          queueCards([cardRequestOne, cardRequestTwo])(editorView.state.tr),
        );

        expect(pluginKey.getState(editorView.state)).toEqual(
          expect.objectContaining({
            requests: [cardRequestOne, cardRequestTwo],
          }),
        );
      });
    });

    describe('resolve', () => {
      it('eventually resolves the url from the queue', async () => {
        const { editorView } = editor(doc(p()));
        const atlassianCardRequest = createCardRequest(atlassianUrl, 1);
        editorView.dispatch(
          queueCards([atlassianCardRequest])(editorView.state.tr),
        );

        editorView.dispatch(resolveCard(atlassianUrl)(editorView.state.tr));

        expect(pluginKey.getState(editorView.state)).toEqual({
          cards: [],
          requests: [],
          provider: null,
          showLinkingToolbar: false,
          events: undefined,
          createAnalyticsEvent,
        });
      });
    });
  });

  describe('analytics', () => {
    const linkTypes = [
      {
        name: 'inlineCard',
        type: 'inline',
        element: p('{<}', inlineCard({ url: atlassianUrl })('{>}')),
      },
      {
        name: 'blockCard',
        type: 'block',
        element: blockCard({ url: atlassianUrl })(),
      },
    ];

    linkTypes.forEach(({ type, name, element }) => {
      describe(`Toolbar ${name}`, () => {
        let editorView: EditorView;
        let refs: Refs;

        beforeEach(() => {
          ({ editorView, refs } = editor(doc(element)));
          if (name === 'blockCard') {
            setNodeSelection(editorView, 0);
          } else {
            setNodeSelection(editorView, refs['<']);
          }
        });

        describe('delete command', () => {
          beforeEach(() => {
            removeCard(editorView.state, editorView.dispatch);
          });

          it('should create analytics V3 event', () => {
            expect(createAnalyticsEvent).toHaveBeenCalledWith({
              action: 'deleted',
              actionSubject: 'smartLink',
              actionSubjectId: name,
              attributes: expect.objectContaining({
                inputMethod: 'toolbar',
                displayMode: name,
              }),
              eventType: 'track',
            });
          });
        });

        describe('visit command', () => {
          let windowSpy: jest.MockInstance<any, any[]>;
          beforeEach(() => {
            windowSpy = jest
              .spyOn(window, 'open')
              .mockImplementation(() => null);
            visitCardLink(editorView.state, editorView.dispatch);
          });

          afterEach(() => {
            windowSpy.mockRestore();
          });

          it('should create analytics V3 event', () => {
            expect(createAnalyticsEvent).toHaveBeenCalledWith({
              action: 'visited',
              actionSubject: 'smartLink',
              actionSubjectId: name,
              attributes: expect.objectContaining({ inputMethod: 'toolbar' }),
              eventType: 'track',
            });
          });

          it('should open a new tab with the right url', () => {
            expect(windowSpy).toHaveBeenCalledWith(atlassianUrl);
          });
        });

        describe('open settings command', () => {
          let windowSpy: jest.MockInstance<any, any[]>;
          beforeEach(() => {
            windowSpy = jest
              .spyOn(window, 'open')
              .mockImplementation(() => null);
            openLinkSettings(editorView.state, editorView.dispatch);
          });

          afterEach(() => {
            windowSpy.mockRestore();
          });

          it('should create analytics V3 event', () => {
            expect(createAnalyticsEvent).toHaveBeenCalledWith({
              action: 'clicked',
              actionSubject: 'button',
              actionSubjectId: 'goToSmartLinkSettings',
              attributes: expect.objectContaining({
                inputMethod: 'toolbar',
                display: type,
              }),
              eventType: 'ui',
            });
          });

          it('should open a new tab with the right url', () => {
            expect(windowSpy).toHaveBeenCalledWith(
              'https://id.atlassian.com/manage-profile/link-preferences',
            );
          });
        });
      });
    });
  });
});
