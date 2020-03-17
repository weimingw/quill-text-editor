import React,  { useState, useRef, forwardRef, useEffect } from 'react';
import { useDropdownBehavior } from './Dropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormattingDropdown = forwardRef(function ({ x, y, currentFormatting, changeFormatting }, ref) {
    const { 
        bold, italic, underline, strike, script,
     } = currentFormatting;

    return <div className='formatting-dropdown quill-dropdown' style={{ left: x, top: y }} ref={ref}>
        <div key='bold' className={`styling-dropdown-item quill-dropdown-item ${ bold ? 'selected' : '' }`}
                onClick={() => changeFormatting('bold', !bold)}>
            <FontAwesomeIcon icon='bold' />
        </div>
        <div key='italic' className={`styling-dropdown-item quill-dropdown-item ${ italic ? 'selected' : '' }`}
                onClick={() => changeFormatting('italic', !italic)}>
            <FontAwesomeIcon icon='italic' />
        </div>
        <div key='underline' className={`styling-dropdown-item quill-dropdown-item ${ underline ? 'selected' : '' }`}
                onClick={() => changeFormatting('underline', !underline)}>
            <FontAwesomeIcon icon='underline' />
        </div>
        <div key='strike' className={`styling-dropdown-item quill-dropdown-item ${ strike ? 'selected' : '' }`}
                onClick={() => changeFormatting('strike', !strike)}>
            <FontAwesomeIcon icon='strikethrough' />
        </div>
        <div key='sub' className={`styling-dropdown-item quill-dropdown-item ${ script === 'sub' ? 'selected' : '' }`}
                onClick={() => changeFormatting('script', script !== 'sub' ? 'sub' : null)}>
            <FontAwesomeIcon icon='subscript' />
        </div>
        <div key='super' className={`styling-dropdown-item quill-dropdown-item ${ script === 'super' ? 'selected' : '' }`}
                onClick={() => changeFormatting('script', script !== 'super' ? 'super' : null)}>
            <FontAwesomeIcon icon='superscript' />
        </div>
    </div>
});

export function useFormattingDropdown({ editor, containerRef }) {
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
        editor.current.format(type, value);
        setCurrentFormatting(editor.current.getFormat());
    }

    useEffect(() => {
        const editorInstance = editor.current;
        if (editorInstance) {
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
    }, [ editor.current ]);

    return {
        renderFormattingButton() {
            return (
                <button className='ql-formatting ql-dropdown-button' ref={formattingButtonRef} onClick={handleFormattingButtonClick}>
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