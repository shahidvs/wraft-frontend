import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { ContentEditor } from './editor.js';
import { useContentEditor } from './useContentEditor.js';

interface EditorProps {
  defaultValue?: any;
  editable: boolean;
  onUpdate: any;
  tokens: any;
  onInserted: Function;
  insertAtPointer?: any;
  insertable?: any;
}
const EditorWrapper = forwardRef(({
  defaultValue,
  editable,
  onUpdate,
  tokens,
  insertable,
  onInserted,
}: EditorProps, ref)  => {
  const { editor, onChange, insertNow, getContext } = useContentEditor(
    defaultValue,
    onUpdate,
    onInserted
  );

  useImperativeHandle(ref, () => editor.getContext(), [editor.getContext]);

  
  useEffect(() => {
    if (insertable) {
      insertNow(insertable);
    }
  }, [insertable]);

  

  return (
    <>
      <ContentEditor
        editor={editor}
        onChange={onChange}
        editable={editable}
        tokens={tokens}
      />
    </>
  );
});

export default EditorWrapper;