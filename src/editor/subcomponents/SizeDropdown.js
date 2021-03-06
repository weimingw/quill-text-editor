import React, { useRef, useState, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactQuill from 'react-quill'

import { useDropdownBehavior, useDropdownButtonBehavior } from './Dropdown';
import './style/SizeDropdown.scss';

const Parchment = ReactQuill.Quill.import('parchment');
const sizeConfig = {
    scope: Parchment.Scope.INLINE,
}
const SizeClass = new Parchment.Attributor.Class('font-size', 'vv-size', sizeConfig);
ReactQuill.Quill.register(SizeClass, true);

const SIZES = [
    { value: '', label: '12 pt' }, 
    { value: '14', label: '14 pt' }, 
    { value: '18', label: '18 pt' }, 
    { value: '24', label: '24 pt' },
]

const SizeDropdown = forwardRef(function (props, ref) {
    const { x, y, size, changeSize } = props;
    return <div style={{ left: x, top: y }} className='vv-size-dropdown vv-editor-dropdown' ref={ref}>
        { 
            SIZES.map(s => 
                <div className={`vv-editor-dropdown-item ${s.value === size.value ? 'selected' : ''}`}
                        key={s.value}
                        onClick={() => changeSize(s)}>
                    {s.label}
                </div>
            )
        }
    </div>
});

export function useSizeDropdown({ editorRef, containerRef }) {
    const sizeButtonRef = useRef(null);
    const [ sizeDropdownOpen, setSizeDropdownOpen ] = useState(false);
    const [ sizeButtonX, setSizeButtonX ] = useState(-500);
    const [ sizeButtonY, setSizeButtonY ] = useState(-500);
    const [ size, setSize ] = useState(SIZES[0]);
    const { dropdownRef } = useDropdownBehavior({
        buttonRef: sizeButtonRef,
        setDropdownOpen: setSizeDropdownOpen
    });
    useDropdownButtonBehavior({ 
        editorRef, 
        options: SIZES, 
        key: 'font-size', 
        setValue: setSize
    });

    function handleSizeButtonClick() {
        const containerPositions = containerRef.current.getBoundingClientRect();
        const buttonPositions = sizeButtonRef.current.getBoundingClientRect();
        
        setSizeDropdownOpen(true);
        setSizeButtonX(buttonPositions.x - containerPositions.x);
        setSizeButtonY(buttonPositions.y - containerPositions.y + buttonPositions.height);
    }

    function changeSize(newSize) {
        editorRef.current.editor.format('font-size', newSize.value);
        setSize(newSize);
        setSizeDropdownOpen(false);
    }

    return {
        renderSizeButton() {
            return (
                <button className='vv-size-button vv-toolbar-button vv-dropdown-button' ref={sizeButtonRef} onClick={handleSizeButtonClick}>
                    <div>{size.label}</div>
                    <FontAwesomeIcon icon='caret-down' />
                </button>
            );
        },
        renderSizeDropdown() {
            return sizeDropdownOpen ? 
                <SizeDropdown x={sizeButtonX} y={sizeButtonY} ref={dropdownRef}
                        size={size} changeSize={changeSize} /> : 
                null;
        },
    }
}