import React, { useRef, useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';

import { useFontDropdown } from './subcomponents/FontDropdown';
import { useFormattingDropdown } from './subcomponents/FormattingDropdown';
import { useLineSpacingDropdown } from './subcomponents/LineSpacingDropdown';
import { useSciSymbolDropdown } from './subcomponents/SciSymbolDropdown';
import { useSizeDropdown } from './subcomponents/SizeDropdown';

export default function RichTextEditor(props) {
    // editorRef.current.editor will store an instance of the editor that can use Quill APIs documented in https://quilljs.com/docs/api/
    const editorRef = useRef(); 
    const toolbarRef = useRef();
    const [ loaded, setLoaded ] = useState(false);
    const [ value, setValue ] = useState();

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
        <div className='vv-rich-text-editor'>
            <div className='vv-editor-toolbar' ref={toolbarRef}>
                <span className="ql-formats">
                    <button className="ql-list" value="ordered"></button>
                    <button className="ql-list" value="bullet"></button>
                    <button className="ql-indent" value="-1"></button>
                    <button className="ql-indent" value="+1"></button>
                </span>
            </div>
            { loaded ? renderTextEditor() : null }
        </div>
    );
}