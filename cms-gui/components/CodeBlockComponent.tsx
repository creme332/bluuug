import styles from "../styles/CodeBlockComponent.module.css";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React from "react";
import { Select } from "@mantine/core";

export default function CodeBlockComponent({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}) {
  return (
    <NodeViewWrapper className={styles.codeBlock}>
      <Select
        className={styles.select}
        data={extension.options.lowlight.listLanguages()}
        defaultValue={defaultLanguage}
        onChange={(value) => {
          console.log(value);
          updateAttributes({ language: value });
        }}
      />
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
