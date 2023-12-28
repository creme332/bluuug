import { Group } from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { Container, Button } from "@mantine/core";
import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { IconCodeDots, IconPhoto } from "@tabler/icons-react";

// load all highlight.js languages
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { createLowlight } from "lowlight";
import React, { useCallback } from "react";

import CodeBlockComponent from "../components/CodeBlockComponent";

const lowlight = createLowlight({ javascript, css, typescript, html });

const content = `
<p>
  That’s a boring paragraph followed by a fenced code block:
</p>
<pre><code class="language-javascript">for (var i=1; i <= 20; i++)
{
if (i % 15 == 0)
console.log("FizzBuzz");
else if (i % 3 == 0)
console.log("Fizz");
else if (i % 5 == 0)
console.log("Buzz");
else
console.log(i);
}</code></pre>
<p>
  Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.
</p>
`;

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

export default function IndexPage() {
  const editor: Editor | null = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      Dropcursor,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
    ],
    content,
  });

  function exportContent() {
    console.log(editor?.getHTML());
  }

  return (
    <Container>
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
      <Group mt={40} justify="center">
        <Button fullWidth onClick={exportContent}>Save</Button>
      </Group>
    </Container>
  );
}
