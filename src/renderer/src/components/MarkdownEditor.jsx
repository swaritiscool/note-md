import { MDXEditor } from '@mdxeditor/editor'
import React from 'react'
import './styles/Editor.css'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

export const MarkDownEditor = ({ ...props }) => {
  return (
    <MDXEditor
      markdown=""
      plugins={[headingsPlugin(), listsPlugin(), quotePlugin(), markdownShortcutPlugin()]}
      contentEditableClassName="Editor"
      styles={{ color: '#fff' }}
      {...props}
    />
  )
}
