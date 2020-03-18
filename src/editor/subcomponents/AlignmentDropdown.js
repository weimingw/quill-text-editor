import React, { useState, useRef, forwardRef } from 'react';
import ReactQuill from 'react-quill';
import { useDropdownBehavior } from './Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Parchment = ReactQuill.Quill.import('parchment');
const alignmentConfig = {
    scope: Parchment.Scope.BLOCK,
}; 
const AlignmentClass = new Parchment.Attributor.Class('alignment', 'vv-align', alignmentConfig);
ReactQuill.Quill.register(AlignmentClass, true);

const ALIGNMENTS = [
    { value: '', icon: 'align-left' }, 
    { value: 'center', icon: 'align-center' }, 
    { value: 'right', icon: 'align-right' }, 
    { value: 'justify', icon: 'align-justify' }, 
];

const AlignmentDropdown = forwardRef(function ({ x, y, currentAlignment, changeAlignment }, ref) {
    return (
        <div 
            ref={ref}
            className='vv-alignment-dropdown vv-editor-dropdown' 
            style={{ left: x, top: y }}
        >
            { ALIGNMENTS.map(a => 
                <div 
                    key={a.value}
                    className={`vv-editor-dropdown-item ${currentAlignment === a.value ? 'vv-selected' : ''}`}
                    onClick={() => changeAlignment(a.value)}
                >
                    <FontAwesomeIcon icon={a.icon} />
                </div>
            ) }
        </div>
    )
});

export function useAlignmentDropdown({ editorRef, containerRef }) {
    const alignmentButtonRef = useRef(null);
    const [ alignmentDropdownOpen, setAlignmentDropdownOpen ] = useState(false);
    const [ alignmentButtonX, setAlignmentButtonX ] = useState(-500);
    const [ alignmentButtonY, setAlignmentButtonY ] = useState(-500);
    const [ currentAlignment, setCurrentalignment ] = useState(1);
    const { dropdownRef } = useDropdownBehavior({
        buttonRef: alignmentButtonRef,
        setDropdownOpen: setAlignmentDropdownOpen,
    });

    
    function handleAlignmentButtonClick() {
        const containerPositions = containerRef.current.getBoundingClientRect();
        const buttonPositions = alignmentButtonRef.current.getBoundingClientRect();
        
        setAlignmentDropdownOpen(true);
        setAlignmentButtonX(buttonPositions.x - containerPositions.x);
        setAlignmentButtonY(buttonPositions.y - containerPositions.y + buttonPositions.height);
    }

    function changeAlignment(newAlignment) {
        setCurrentalignment(newAlignment);
        setAlignmentDropdownOpen(false);

        editorRef.current.editor.format('alignment', newAlignment);
    }

    return {
        renderAlignmentButton() {
            return (
                <button 
                    className='vv-alignment vv-dropdown-button vv-toolbar-button'
                    ref={alignmentButtonRef} 
                    onClick={handleAlignmentButtonClick}
                >
                    <FontAwesomeIcon icon='align-left' />
                    <FontAwesomeIcon icon='caret-down' />
                </button>
            )
        },
        renderAlignmentDropdown() {
            return alignmentDropdownOpen ?
                <AlignmentDropdown 
                    x={alignmentButtonX} 
                    y={alignmentButtonY} 
                    ref={dropdownRef}
                    currentAlignment={currentAlignment}
                    changeAlignment={changeAlignment}
                /> :
                null;
        },
    }
}