import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

function CodeEditor({ value, onChange, language }) {
  const [editorHeight, setEditorHeight] = useState('300px');

  const handleEditorChange = (newValue) => {
    onChange(newValue);
    // Balandlikni sozlash
    const lineCount = newValue.split('\n').length;
    setEditorHeight(`${Math.max(300, lineCount * 18)}px`);
  };

  return (
    <div className="code-editor-container">
      <MonacoEditor
        height={editorHeight}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  );
}

export default CodeEditor;