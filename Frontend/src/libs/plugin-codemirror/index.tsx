import {
  EditorView,
  Decoration,
  ViewPlugin,
  ViewUpdate,
  type DecorationSet,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

export const createHighlightPlugin = (lines: number[]) =>
  ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = this.buildDeco(view, lines);
      }
      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged)
          this.decorations = this.buildDeco(update.view, lines);
      }
      buildDeco(view: EditorView, lines: number[]) {
        const decos = [];
        for (const n of lines) {
          const line = view.state.doc.line(n);
          decos.push(
            Decoration.line({
              // attributes: { class: "bg-yellow-200" },
              attributes: {
                style: "background-color: var(--highlight-line-color);",
              },
            }).range(line.from),
          );
        }
        return Decoration.set(decos);
      }
    },
    { decorations: (v) => v.decorations },
  );

// Plugin bôi đậm chữ in hoa
export const boldUppercasePlugin = ViewPlugin.fromClass(
  class {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decorations: any;

    constructor(view: EditorView) {
      this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.buildDecorations(update.view);
      }
    }

    buildDecorations(view: EditorView) {
      const builder = new RangeSetBuilder<Decoration>();
      const regex =
        /\b[A-ZĐÀÁẠẢÃĂẮẰẶẲẴÂẦẤẬẨẪÊỀẾỆỂỄÔỒỐỘỔỖƠỜỚỢỞỠƯỪỨỰỬỮỲÝỴỶỸ]+\b/g;

      for (const { from, text } of view.visibleRanges.map((r) => ({
        from: r.from,
        to: r.to,
        text: view.state.doc.sliceString(r.from, r.to),
      }))) {
        let match;
        while ((match = regex.exec(text)) !== null) {
          const start = from + match.index;
          const end = start + match[0].length;
          builder.add(start, end, Decoration.mark({ class: "uppercase-bold" }));
        }
      }

      return builder.finish();
    }
  },
  {
    decorations: (v) => v.decorations,
  },
);
