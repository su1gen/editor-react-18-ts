import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { TextSelection } from 'prosemirror-state';
export default new SafePlugin({
  props: {
    handleClick: function handleClick(view, clickPos, event) {
      // Don't apply in Edge as per ED-4546
      if (navigator && /Edge\/\d/.test(navigator.userAgent)) {
        return false;
      } // @see ED-6231


      if (clickPos > view.state.doc.content.size) {
        return false;
      }

      var code = view.state.schema.marks.code;
      var paragraph = view.state.schema.nodes.paragraph;
      var $click = view.state.doc.resolve(clickPos);
      var clickWasAtEdgeOfATextNode = ($click.nodeBefore ? $click.nodeBefore.isInline : $click.nodeAfter) && ($click.nodeAfter ? $click.nodeAfter.isInline : $click.nodeBefore) && $click.textOffset === 0;
      var clickWasNearACodeMark = code && ($click.nodeBefore && code.isInSet($click.nodeBefore.marks) || $click.nodeAfter && code.isInSet($click.nodeAfter.marks)); // Find the starting position of the clicked dom-element
      // TODO: Remove calls to private API

      var clickedDOMElementPosition = event.target && event.target instanceof Node && view.posAtDOM(event.target);
      var clickNode = view.state.doc.nodeAt(clickPos);
      var clickWasAtTextNode = !!(clickNode && clickNode.isText);
      var clickWasAtEndOfAParagraphNode = $click.parent.type === paragraph && $click.textOffset === 0 && $click.nodeAfter === null;

      if (clickWasAtEdgeOfATextNode && clickWasNearACodeMark && clickedDOMElementPosition && ( // if click did not occur at a text node or end of paragraph, then
      // it was at a directly adjacent non-text node, so we skip this manual
      // text selection logic to preserve that non-text node's selection
      clickWasAtTextNode || clickWasAtEndOfAParagraphNode)) {
        var clickWasInsideNodeDOM = event.target.parentNode === view.domAtPos(clickedDOMElementPosition).node && code.isInSet(view.state.doc.resolve(clickedDOMElementPosition).nodeAfter.marks);
        var nodeNextToClick = $click.nodeBefore && code.isInSet($click.nodeBefore.marks) ? $click.nodeAfter : $click.nodeBefore; // Need to set the selection here to allow clicking between [code('text'),{<>},emoji()]

        var tr = view.state.tr.setSelection(TextSelection.near($click));

        if (clickWasInsideNodeDOM) {
          tr.setStoredMarks([code.create()]);
        } else {
          tr.setStoredMarks(nodeNextToClick ? nodeNextToClick.marks : []);
        }

        view.dispatch(tr);
        return true;
      }

      return false;
    }
  }
});