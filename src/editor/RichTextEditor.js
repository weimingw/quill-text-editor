import React, { useRef, useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';

import './style/RichTextEditor.scss';
import { useFontDropdown } from './subcomponents/FontDropdown';
import { useFormattingDropdown } from './subcomponents/FormattingDropdown';
import { useLineSpacingDropdown } from './subcomponents/LineSpacingDropdown';
import { useSciSymbolDropdown } from './subcomponents/SciSymbolDropdown';
import { useSizeDropdown } from './subcomponents/SizeDropdown';

export default function RichTextEditor(props) {
    // editorRef.current.editor.editor will store an instance of the editor that can use Quill APIs documented in https://quilljs.com/docs/api/
    const editorRef = useRef(); 
    const containerRef = useRef();
    const toolbarRef = useRef();
    const [ loaded, setLoaded ] = useState(false);
    const [ value, setValue ] = useState();

    const { renderFontButton, renderFontDropdown } = 
        useFontDropdown({ editorRef, containerRef })

    const { renderSizeButton, renderSizeDropdown } = 
        useSizeDropdown({ editorRef, containerRef })

    const { renderLineSpacingButton, renderLineSpacingDropdown } =
        useLineSpacingDropdown({ editorRef, containerRef });

    const { renderSciSymbolDropdown, renderSciSymbolButton } = 
        useSciSymbolDropdown({ editorRef, containerRef });

    const { renderFormattingButton, renderFormattingDropdown } = 
        useFormattingDropdown({ editorRef, containerRef });

    useEffect(() => {
        setLoaded(true);
    }, []);

    function renderTextEditor() {
        const modules = {
            toolbar: toolbarRef.current,
        };

        return (
            <ReactQuill 
                ref={editorRef}
                onChange={(html) => setValue(html)}
                modules={modules}

                theme='snow'
            />
        );
    }

    return (
        <div className='vv-rich-text-editor' ref={containerRef}>
            { renderFontDropdown() }
            { renderSizeDropdown() }
            { renderFormattingDropdown() }
            { renderLineSpacingDropdown() }
            { renderSciSymbolDropdown() }
            <div className='vv-editor-toolbar' ref={toolbarRef}>
            <span className="ql-formats">
                    { renderFontButton() }
                    { renderSizeButton() }
                </span>
                <span className="ql-formats">
                    { renderFormattingButton() }
                </span>
                <span className="ql-formats">
                    <select className="ql-align"></select>
                    { renderLineSpacingButton() }
                    <button className="ql-list" value="ordered"></button>
                    <button className="ql-list" value="bullet"></button>
                    <button className="ql-indent" value="-1"></button>
                    <button className="ql-indent" value="+1"></button>
                </span>
                <span className="ql-formats">
                    { renderSciSymbolButton() }
                </span>
                <span className="ql-formats">
                    <button className="ql-link"></button>
                </span>
                <span className="ql-formats">
                    <button className="ql-clean"></button>
                </span>
            </div>
            { loaded ? renderTextEditor() : null }
        </div>
    );
}