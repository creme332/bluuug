import { RichTextEditor, Link } from "@mantine/tiptap";
import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { IconCodeDots, IconPhoto } from "@tabler/icons-react";
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'

// load all highlight.js languages
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { createLowlight } from "lowlight";
import React, { useCallback } from "react";

import CodeBlockComponent from "../components/CodeBlockComponent";

const lowlight = createLowlight({ javascript, css, typescript, html });

const CodeBlock = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  return (
    <RichTextEditor.Control
      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      aria-label="Add code block"
      title="Add code block"
      className={editor.isActive("codeBlock") ? "is-active" : ""}
    >
      <IconCodeDots stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
};

const ImageControl = ({ editor }: { editor: Editor | null }) => {
  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL");
    const alt = window.prompt("ALT");

    if (url && alt) {
      editor.chain().focus().setImage({ src: url, alt }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <RichTextEditor.Control
      onClick={addImage}
      aria-label="Add image"
      title="Add image"
      className={editor.isActive("codeBlock") ? "is-active" : ""}
    >
      <IconPhoto stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
};

interface TextEditorInterface {
  body: string;
  updateContent: (newContent: string) => void;
}

export default function TextEditor({
  body,
  updateContent,
}: TextEditorInterface) {
  const editor: Editor | null = useEditor({
    extensions: [
      StarterKit,
      Image,
      Underline,
      Highlight,
      Link,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
    ],
    content: body,
    onUpdate({ editor }) {
      if (!editor) return;
      updateContent(editor.getHTML());
    },
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
          <CodeBlock editor={editor} />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
          <ImageControl editor={editor} />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
