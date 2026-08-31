"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useState } from "react";
import styles from "./admin.module.css";

export function RichTextEditor({
  name,
  defaultValue,
  label,
}: {
  name: string;
  defaultValue?: string;
  label?: string;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: defaultValue ?? "",
    editorProps: {
      attributes: { class: styles.richTextContent },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.richTextEditor}>
        {editor && (
          <div className={styles.richTextToolbar}>
            <button
              type="button"
              className={editor.isActive("bold") ? styles.richTextButtonActive : styles.richTextButton}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              className={editor.isActive("italic") ? styles.richTextButtonActive : styles.richTextButton}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              className={editor.isActive("bulletList") ? styles.richTextButtonActive : styles.richTextButton}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              • Lijst
            </button>
            <button
              type="button"
              className={editor.isActive("orderedList") ? styles.richTextButtonActive : styles.richTextButton}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              1. Lijst
            </button>
            <button
              type="button"
              className={editor.isActive("link") ? styles.richTextButtonActive : styles.richTextButton}
              onClick={() => {
                if (editor.isActive("link")) {
                  editor.chain().focus().unsetLink().run();
                  return;
                }
                const url = window.prompt("Link URL");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
            >
              Link
            </button>
            <button
              type="button"
              className={styles.richTextButton}
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            >
              Wis opmaak
            </button>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
