import styles from "../styles/CodeBlockComponent.module.css";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Select } from "@mantine/core";
import React, { FunctionComponent } from "react";

interface CodeBlockComponentProps {
  node: {
    attrs: {
      language: string;
    };
  };
  updateAttributes: (attrs: { language: string }) => void;
  extension: {
    options: {
      lowlight: {
        listLanguages: () => string[]; // Assuming listLanguages returns an array of strings
      };
    };
  };
}

const CodeBlockComponent: FunctionComponent<CodeBlockComponentProps> = ({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}) => {
  return (
    <NodeViewWrapper className={styles.codeBlock}>
      <Select
        className={styles.select}
        data={extension.options.lowlight.listLanguages()}
        defaultValue={defaultLanguage}
        onChange={(value) => {
          if (!value) return;
          updateAttributes({ language: value });
        }}
      />
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};

export default CodeBlockComponent;
