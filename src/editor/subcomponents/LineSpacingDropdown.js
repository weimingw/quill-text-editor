import React,  { useState, useRef, forwardRef } from 'react';
import ReactQuill from 'react-quill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './style/LineSpacingDropdown.scss';
import { useDropdownBehavior } from './Dropdown';

// needed for line spacing
const Parchment = ReactQuill.Quill.import('parchment');
const lineSpacingConfig = {
    scope: Parchment.Scope.BLOCK,
}; 
const LineHeightClass = new Parchment.Attributor.Class('line-spacing', 'vv-line-spacing', lineSpacingConfig);
ReactQuill.Quill.register(LineHeightClass, true);

const SPACING = [
    { value: '', label: 'Auto' },
    { value: '1', label: 1 }, 
    { value: '2', label: 2 },
    { value: '3', label: 3 },
];

const LineSpacingDropdown = forwardRef(function ({ x, y, currentLineSpacing, changeLineSpacing }, ref) {
    return <div className='vv-ls-dropdown vv-editor-dropdown' style={{ left: x, top: y }} ref={ref}>
        { SPACING.map(s => (
            <div 
                key={s.value} 
                className={`vv-editor-dropdown-item ${currentLineSpacing === s.value ? 'vv-selected' : ''}`}
                onClick={() => changeLineSpacing(s.value)}
            >
                {s.label}
            </div>
        )) }
    </div>
});

export function useLineSpacingDropdown({ editorRef, containerRef }) {
    const lineSpacingButtonRef = useRef(null);
    const [ lineSpacingDropdownOpen, setLineSpacingDropdownOpen ] = useState(false);
    const [ lineSpacingButtonX, setLineSpacingButtonX ] = useState(-500);
    const [ lineSpacingButtonY, setLineSpacingButtonY ] = useState(-500);
    const [ currentLineSpacing, setCurrentLineSpacing ] = useState(1);
    const { dropdownRef } = useDropdownBehavior({
        buttonRef: lineSpacingButtonRef,
        setDropdownOpen: setLineSpacingDropdownOpen,
    });

    function handleLineSpacingButtonClick() {
        const containerPositions = containerRef.current.getBoundingClientRect();
        const buttonPositions = lineSpacingButtonRef.current.getBoundingClientRect();
        
        setLineSpacingDropdownOpen(true);
        setLineSpacingButtonX(buttonPositions.x - containerPositions.x);
        setLineSpacingButtonY(buttonPositions.y - containerPositions.y + buttonPositions.height);
    }

    function changeLineSpacing(newLineSpacing) {
        setCurrentLineSpacing(newLineSpacing);
        setLineSpacingDropdownOpen(false);

        editorRef.current.editor.format('line-spacing', newLineSpacing);
    }

    return {
        renderLineSpacingButton() {
            return (
                <button 
                    className='vv-line-height vv-dropdown-button vv-toolbar-button' 
                    ref={lineSpacingButtonRef} 
                    onClick={handleLineSpacingButtonClick}
                >
                    <FontAwesomeIcon icon='bars' />
                    <FontAwesomeIcon icon='caret-down' />
                </button>
            );
        },
        renderLineSpacingDropdown() {
            return lineSpacingDropdownOpen ? 
                <LineSpacingDropdown 
                    x={lineSpacingButtonX} 
                    y={lineSpacingButtonY} 
                    ref={dropdownRef}
                    currentLineSpacing={currentLineSpacing} 
                    changeLineSpacing={changeLineSpacing} 
                /> : 
                null;
        }
    }
}