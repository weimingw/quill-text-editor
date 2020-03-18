import React, { useRef, useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';

import './style/RichTextEditor.scss';
import './style/RichTextFormatting.scss';
import { useFontDropdown } from './subcomponents/FontDropdown';
import { useFormattingDropdown } from './subcomponents/FormattingDropdown';
import { useLineSpacingDropdown } from './subcomponents/LineSpacingDropdown';
import { useSciSymbolDropdown } from './subcomponents/SciSymbolDropdown';
import { useSizeDropdown } from './subcomponents/SizeDropdown';
import { useAlignmentDropdown } from './subcomponents/AlignmentDropdown';

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

    const { renderAlignmentButton, renderAlignmentDropdown } = 
        useAlignmentDropdown({ editorRef, containerRef });

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
            { renderAlignmentDropdown() }
            { renderLineSpacingDropdown() }
            { renderSciSymbolDropdown() }
            <div className='vv-editor-toolbar' ref={toolbarRef}>
            <span className="vv-format-group">
                    { renderFontButton() }
                    { renderSizeButton() }
                </span>
                <span className="vv-format-group">
                    { renderFormattingButton() }
                </span>
                <span className="vv-format-group">
                    { renderAlignmentButton() }
                    { renderLineSpacingButton() }
                    <button className="ql-list vv-toolbar-button" value="ordered"></button>
                    <button className="ql-list vv-toolbar-button" value="bullet"></button>
                    <button className="ql-indent vv-toolbar-button" value="-1"></button>
                    <button className="ql-indent vv-toolbar-button" value="+1"></button>
                </span>
                <span className="vv-format-group">
                    { renderSciSymbolButton() }
                </span>
                <span className="vv-format-group">
                    <button className="ql-link vv-toolbar-button"></button>
                </span>
                <span className="vv-format-group">
                    <button className="ql-clean vv-toolbar-button"></button>
                </span>
            </div>
            { loaded ? renderTextEditor() : null }
        </div>
    );
}