import type {
  ApplySchemaAttributes,
  CommandFunction,
  InputRule,
  NodeExtensionSpec,
  NodeSpecOverride,
  Transaction,
} from "@remirror/core";
import {
  command,
  ErrorConstant,
  extension,
  ExtensionTag,
  invariant,
  isEmptyBlockNode,
  isNodeSelection,
  NodeExtension,
  nodeInputRule,
} from "@remirror/core";
import { TextSelection } from "@remirror/pm/state";
import { insertPageBreakOptions } from "./page-break-utils.js";

export interface PageBreakOptions {
  /**
   * The name of the node to insert after inserting a pageBreak.
   *
   * Set to false to prevent adding a node afterwards.
   *
   * @defaultValue 'paragraph'
   */
  insertionNode?: string | false;
}

/**
 * Adds a horizontal line to the editor.
 */
@extension<PageBreakOptions>({
  defaultOptions: { insertionNode: "paragraph" },
  staticKeys: [],
  handlerKeys: [],
  customHandlerKeys: [],
})
export class PageBreakExtension extends NodeExtension<PageBreakOptions> {
  get name() {
    return "pageBreak" as const;
  }

  createTags() {
    return [ExtensionTag.Block];
  }

  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride,
  ): NodeExtensionSpec {
    return {
      ...override,
      attrs: extra.defaults(),
      parseDOM: [
        { tag: "\newpage", getAttrs: extra.parse },
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node) => {
        // Adding a class to the hr element
        const attrs = extra.dom(node);
        attrs.class = attrs.class ? `${attrs.class} pagebreak` : "pagebreak-";
        return ["hr", attrs];
      },
    };
  }

  /**
   * Inserts a horizontal line into the editor.
   */
  @command(insertPageBreakOptions)
  insertPageBreak(): CommandFunction {
    return (props) => {
      const { tr, dispatch } = props;
      const $pos = tr.selection.$anchor;
      const initialParent = $pos.parent;

      if (
        initialParent.type.name === "doc" ||
        initialParent.isAtom ||
        initialParent.isLeaf
      ) {
        return false;
      }

      if (!dispatch) {
        return true;
      }

      // A boolean value that is true when the current node is empty and
      // should be duplicated before the replacement of the current node by
      // the `hr`.
      const shouldDuplicateEmptyNode =
        tr.selection.empty && isEmptyBlockNode(initialParent);

      // When the node should eb duplicated add it to the position after
      // before the replacement.
      if (shouldDuplicateEmptyNode) {
        tr.insert($pos.pos + 1, initialParent);
      }

      // Create the horizontal rule by replacing the selection
      tr.replaceSelectionWith(this.type.create());

      // Update the selection if currently pointed at the node.
      this.updateFromNodeSelection(tr);

      dispatch(tr.scrollIntoView());

      return true;
    };
  }

  createInputRules(): InputRule[] {
    return [
      nodeInputRule({
        // Allow dash + hyphen to cater for ShortcutsExtension, which replaces first
        // two hyphens with a dash, i.e. "---" becomes "<dash>-"
        // regexp: /^(?:~~~|~~)$/,
        regexp: /\\newpage$/,
        type: this.type,
        beforeDispatch: ({ tr }) => {
          // Update to using a text selection.
          this.updateFromNodeSelection(tr);
        },
      }),
    ];
  }

  /**
   * Updates the transaction after a `pageBreak` has been inserted to make
   * sure the currently selected node isn't a Horizontal Rule.
   *
   * This should only be called for empty selections.
   */
  private updateFromNodeSelection(tr: Transaction): void {
    // Make sure  the `pageBreak` that is selected. Otherwise do nothing.
    if (
      !isNodeSelection(tr.selection) ||
      tr.selection.node.type.name !== this.name
    ) {
      return;
    }

    // Get the position right after the current selection for inserting the
    // node.
    const pos = tr.selection.$from.pos + 1;
    const { insertionNode } = this.options;

    // If `insertionNode` was set to false, then don't insert anything.
    if (!insertionNode) {
      return;
    }

    const type = this.store.schema.nodes[insertionNode];

    invariant(type, {
      code: ErrorConstant.EXTENSION,
      message: `'${insertionNode}' node provided as the insertionNode to the '${this.constructorName}' does not exist.`,
    });

    // Insert the new node
    const node = type.create();
    tr.insert(pos, node);

    // Set the new selection to be inside the inserted node.
    tr.setSelection(TextSelection.near(tr.doc.resolve(pos + 1)));
  }
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      pageBreak: PageBreakExtension;
    }
  }
}
