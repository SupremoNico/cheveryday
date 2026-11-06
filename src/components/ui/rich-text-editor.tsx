"use client";

import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  ListTodo,
} from "lucide-react";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write something...",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-text-content",
      },
    },
  });

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor?.isActive("bold") ?? false,
      isItalic: editor?.isActive("italic") ?? false,
      isUnderline: editor?.isActive("underline") ?? false,
      isBulletList: editor?.isActive("bulletList") ?? false,
      isOrderedList: editor?.isActive("orderedList") ?? false,
      isTaskList: editor?.isActive("taskList") ?? false,
    }),
  }) ?? {
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isBulletList: false,
    isOrderedList: false,
    isTaskList: false,
  };

  if (!editor) return null;

  const toolbarButton = (active: boolean) =>
    `rich-text-toolbar-button${active ? " active" : ""}`;

  return (
    <div className="rich-text-editor">
      <div className="rich-text-toolbar">
        <button
          type="button"
          title="Bold"
          aria-label="Bold"
          className={toolbarButton(editorState.isBold)}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          title="Italic"
          aria-label="Italic"
          className={toolbarButton(editorState.isItalic)}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </button>

        <button
          type="button"
          title="Underline"
          aria-label="Underline"
          className={toolbarButton(editorState.isUnderline)}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={16} />
        </button>

        <div className="rich-text-toolbar-divider" />

        <button
          type="button"
          title="Bullet list"
          aria-label="Bullet list"
          className={toolbarButton(editorState.isBulletList)}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </button>

        <button
          type="button"
          title="Numbered list"
          aria-label="Numbered list"
          className={toolbarButton(editorState.isOrderedList)}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </button>

        <div className="rich-text-toolbar-divider" />

        <button
          type="button"
          title="Checklist"
          aria-label="Checklist"
          className={toolbarButton(editorState.isTaskList)}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <ListTodo size={16} />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
