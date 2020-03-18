import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Parchment = ReactQuill.Quill.import('parchment');
const indentConfig = {
    scope: Parchment.Scope.BLOCK,
}; 
const IndentClass = new Parchment.Attributor.Class('indent', 'vv-indent', indentConfig);
ReactQuill.Quill.register(IndentClass, true);

export function useIndentation({ editorRef }) {
    const [ currentIndent, setCurrentIndent ] = useState(0);

    function increaseIndent() {
        if (currentIndent < 8) {
            editorRef.current.editor.format('indent', currentIndent + 1);
            setCurrentIndent(currentIndent + 1);
        }
    }

    function decreaseIndent() {
        if (currentIndent > 0) {
            editorRef.current.editor.format('indent', currentIndent - 1);
            setCurrentIndent(currentIndent - 1);
        }
    }

    return {
        renderIndentLessButton() {
            return (
                <button
                    onClick={decreaseIndent}
                    className='vv-toolbar-button'
                >
                    <FontAwesomeIcon icon='outdent' />
                </button>
            )
        },
        renderIndentMoreButton() {
            return (
                <button
                    onClick={increaseIndent}
                    className='vv-toolbar-button'
                >
                    <FontAwesomeIcon icon='indent' />
                </button>
            )
        }
    }
}