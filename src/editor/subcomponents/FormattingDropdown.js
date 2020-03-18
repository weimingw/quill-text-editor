import React,  { useState, useRef, forwardRef, useEffect } from 'react';
import { useDropdownBehavior } from './Dropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormattingDropdown = forwardRef(function ({ x, y, currentFormatting, changeFormatting }, ref) {
    const { 
        bold, italic, underline, strike, script,
     } = currentFormatting;

    return (
        <div 
            className='vv-formatting-dropdown vv-editor-dropdown' 
            style={{ left: x, top: y }} ref={ref}
        >
            <div key='bold' className={`styling-dropdown-item vv-editor-dropdown-item ${ bold ? 'vv-selected' : '' }`}
                    onClick={() => changeFormatting('bold', !bold)}>
                <FontAwesomeIcon icon='bold' />
            </div>
            <div key='italic' className={`styling-dropdown-item vv-editor-dropdown-item ${ italic ? 'vv-selected' : '' }`}
                    onClick={() => changeFormatting('italic', !italic)}>
                <FontAwesomeIcon icon='italic' />
            </div>
            <div key='underline' className={`styling-dropdown-item vv-editor-dropdown-item ${ underline ? 'vv-selected' : '' }`}
                    onClick={() => changeFormatting('underline', !underline)}>
                <FontAwesomeIcon icon='underline' />
            </div>
            <div key='strike' className={`styling-dropdown-item vv-editor-dropdown-item ${ strike ? 'vv-selected' : '' }`}
                    onClick={() => changeFormatting('strike', !strike)}>
                <FontAwesomeIcon icon='strikethrough' />
            </div>
            <div key='sub' className={`styling-dropdown-item vv-editor-dropdown-item ${ script === 'sub' ? 'vv-selected' : '' }`}
                    onClick={() => changeFormatting('script', script !== 'sub' ? 'sub' : null)}>
                <FontAwesomeIcon icon='subscript' />
            </div>
            <div key='super' className={`styling-dropdown-item vv-editor-dropdown-item ${ script === 'super' ? 'vv-selected' : '' }`}
                    onClick={() => changeFormatting('script', script !== 'super' ? 'super' : null)}>
                <FontAwesomeIcon icon='superscript' />
            </div>
        </div>
    );
});

export function useFormattingDropdown({ editorRef, containerRef }) {
    const formattingButtonRef = useRef(null);
    const [ formattingDropdownOpen, setFormattingDropdownOpen ] = useState(false);
    const [ formattingButtonX, setFormattingButtonX ] = useState(-500);
    const [ formattingButtonY, setFormattingButtonY ] = useState(-500);
    const [ currentFormatting, setCurrentFormatting ] = useState({ });
    const { dropdownRef } = useDropdownBehavior({
        buttonRef: formattingButtonRef,
        setDropdownOpen: setFormattingDropdownOpen,
    });

    function handleFormattingButtonClick() {
        const containerPositions = containerRef.current.getBoundingClientRect();
        const buttonPositions = formattingButtonRef.current.getBoundingClientRect();
        
        setFormattingDropdownOpen(true);
        setFormattingButtonX(buttonPositions.x - containerPositions.x);
        setFormattingButtonY(buttonPositions.y - containerPositions.y + buttonPositions.height);
    }

    function changeFormatting(type, value) {
        setFormattingDropdownOpen(false);
        editorRef.current.editor.format(type, value);
        setCurrentFormatting(editorRef.current.editor.getFormat());
    }

    useEffect(() => {
        if (editorRef.current) {
            const editorInstance = editorRef.current.editor;
            const callback = (range) => {
                if (range)
                    setCurrentFormatting(editorInstance.getFormat());
            };
            editorInstance.on('selection-change', callback);
            return () => editorInstance.off('selection-change', callback);
        }

        // eslint complains about ref.current not updating component, 
        // and yet the effect won't re-run with a value unless I use ref.current
        // eslint-disable-next-line
    }, [ editorRef.current ]);

    return {
        renderFormattingButton() {
            return (
                <button className='vv-formatting-button vv-dropdown-button vv-toolbar-button' ref={formattingButtonRef} onClick={handleFormattingButtonClick}>
                    <FontAwesomeIcon icon='bold' />
                    <FontAwesomeIcon icon='caret-down' />
                </button>
            );
        },
        renderFormattingDropdown() {
            return formattingDropdownOpen ? 
                <FormattingDropdown x={formattingButtonX} y={formattingButtonY} ref={dropdownRef} 
                        currentFormatting={currentFormatting}
                        changeFormatting={changeFormatting} /> : 
                null;
        }
    }
}