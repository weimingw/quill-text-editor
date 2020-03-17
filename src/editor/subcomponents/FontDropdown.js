import React, { useRef, useState, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactQuill from 'react-quill';

import { useDropdownBehavior, useDropdownButtonBehavior } from './Dropdown';

const Parchment = ReactQuill.Quill.import('parchment');
const fontConfig = {
    scope: Parchment.Scope.INLINE,
}
const FontClass = new Parchment.Attributor.Class('font-family', 'ql-font', fontConfig);
ReactQuill.Quill.register(FontClass, true);

const FONTS = [
    { value: '', label: 'Arial' }, 
    { value: 'times-new-roman', label: 'Times New Roman' }, 
    { value: 'inconsolata', label: 'Inconsolata' },
];

const FontDropdown = forwardRef(function (props, ref) {
    const { x, y, font, changeFont } = props;
    return <div style={{ left: x, top: y }} className='vv-font-dropdown vv-editor-dropdown' ref={ref}>
        { 
            FONTS.map(s => 
                <div className={`vv-editor-dropdown-item ${s.value === font.value ? 'selected' : ''} ql-font-${s.value}`}
                        key={s.value}
                        onClick={() => changeFont(s)}>
                    {s.label}
                </div>
            )
        }
    </div>
});

export function useFontDropdown({ editorRef, containerRef }) {
    const fontButtonRef = useRef(null);
    const [ fontDropdownOpen, setFontDropdownOpen ] = useState(false);
    const [ fontButtonX, setFontButtonX ] = useState(-500);
    const [ fontButtonY, setFontButtonY ] = useState(-500);
    const [ font, setFont ] = useState(FONTS[0]);
    const { dropdownRef } = useDropdownBehavior({
        buttonRef: fontButtonRef,
        setDropdownOpen: setFontDropdownOpen
    });

    useDropdownButtonBehavior({ 
        editorRef, 
        options: FONTS, 
        key: 'font-family', 
        setValue: setFont
    });

    function handleFontButtonClick() {
        const containerPositions = containerRef.current.getBoundingClientRect();
        const buttonPositions = fontButtonRef.current.getBoundingClientRect();
        
        setFontDropdownOpen(true);
        setFontButtonX(buttonPositions.x - containerPositions.x);
        setFontButtonY(buttonPositions.y - containerPositions.y + buttonPositions.height);
    }

    function changeFont(newFont) {
        editorRef.current.editor.format('font-family', newFont.value);
        setFont(newFont);
        setFontDropdownOpen(false);
    }

    return {
        renderFontButton() {
            return (
                <button className='ql-font' ref={fontButtonRef} onClick={handleFontButtonClick}>
                    <div className='ql-font-name'>{font.label}</div>
                    <FontAwesomeIcon icon='caret-down' />
                </button>
            );
        },
        renderFontDropdown() {
            return fontDropdownOpen ? 
                <FontDropdown x={fontButtonX} y={fontButtonY} ref={dropdownRef}
                        font={font} changeFont={changeFont} /> : 
                null;
        },
    }
}