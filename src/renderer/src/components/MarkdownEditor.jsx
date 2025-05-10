import {
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  MDXEditor,
  tablePlugin
} from '@mdxeditor/editor'
import React from 'react'
import './styles/Editor.css'
import { headingsPlugin, listsPlugin, quotePlugin, markdownShortcutPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

export const MarkDownEditor = ({ ...props }) => {
  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        tablePlugin(),
        imagePlugin()
      ]}
      contentEditableClassName="Editor"
      styles={{ color: '#fff' }}
      {...props}
    />
  )
}
