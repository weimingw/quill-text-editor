import React,  { useState, useRef, forwardRef } from 'react';
import Quill from 'quill';
import { useDropdownBehavior } from './Dropdown';

import lineSpacingIcon from '../icons/line-spacing.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// needed for line spacing
const Parchment = Quill.import('parchment');
const lineSpacingConfig = {
    scope: Parchment.Scope.BLOCK,
}; 
const LineHeightClass = new Parchment.Attributor.Class('line-spacing', 'ql-line-spacing', lineSpacingConfig);
Quill.register(LineHeightClass, true);

const SPACING = [
    { value: '', label: 'Auto' },
    { value: '1', label: 1 }, 
    { value: '2', label: 2 },
    { value: '3', label: 3 },
];

const LineSpacingDropdown = forwardRef(function ({ x, y, currentLineSpacing, changeLineSpacing }, ref) {
    return <div className='ls-dropdown quill-dropdown' style={{ left: x, top: y }} ref={ref}>
        { SPACING.map(s => (
            <div key={s.value} className={`ls-dropdown-item quill-dropdown-item ${currentLineSpacing === s ? 'ls-current' : ''}`}
                    onClick={() => changeLineSpacing(s.value)}>
                {s.label}
            </div>
        )) }
    </div>
});

export function useLineSpacingDropdown({ editor, containerRef }) {
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

        editor.current.format('line-spacing', newLineSpacing);
    }

    return {
        renderLineSpacingButton() {
            return (
                <button className='ql-line-height ql-dropdown-button' ref={lineSpacingButtonRef} onClick={handleLineSpacingButtonClick}>
                    <img src={lineSpacingIcon} alt='line spacing button' />
                    <FontAwesomeIcon icon='caret-down' />
                </button>
            );
        },
        renderLineSpacingDropdown() {
            return lineSpacingDropdownOpen ? 
                <LineSpacingDropdown x={lineSpacingButtonX} y={lineSpacingButtonY} ref={dropdownRef}
                        currentLineSpacing={currentLineSpacing} changeLineSpacing={changeLineSpacing} /> : 
                null;
        }
    }
}