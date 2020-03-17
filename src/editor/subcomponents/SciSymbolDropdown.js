import React, { useState, useRef, forwardRef } from 'react';
import { useDropdownBehavior } from './Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SYMBOL_LIST = [
    { name: 'alpha', symbol: 'α' },
    { name: 'beta', symbol: 'β' }, 
    { name: 'pi', symbol: 'π' }, 
]

const SciSymbolDropdown = forwardRef(function (props, ref) {
    const { x, y } = props;
    const [ searchTerm, setSearchTerm ] = useState('');

    return <div style={{ left: x, top: y }} className='sci-dropdown vv-editor-dropdown' ref={ref}>
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}></input>
        <div>
            { 
                SYMBOL_LIST.map(s => {
                    return s.name.includes(searchTerm) ? 
                        <div className='sci-dropdown-item vv-editor-dropdown-item' 
                                key={s.name}
                                onClick={() => props.addSymbol(s.symbol)}>
                            {s.symbol}
                        </div> :
                        null
                })
            }
        </div>
    </div>
});
export default SciSymbolDropdown;

export function useSciSymbolDropdown({ editorRef, containerRef }) {
    const sciButtonRef = useRef(null);
    const [ sciDropdownOpen, setSciDropdownOpen ] = useState(false);
    const [ sciDropdownX, setSciDropdownX ] = useState(-500);
    const [ sciDropdownY, setSciDropdownY ] = useState(-500);
    const { dropdownRef } = useDropdownBehavior({
        buttonRef: sciButtonRef,
        setDropdownOpen: setSciDropdownOpen
    });

    function displaySciSymbolDropdown() {
        const containerPositions = containerRef.current.getBoundingClientRect();
        const buttonPositions = sciButtonRef.current.getBoundingClientRect();
        
        setSciDropdownOpen(true);
        setSciDropdownX(buttonPositions.x - containerPositions.x);
        setSciDropdownY(buttonPositions.y - containerPositions.y + buttonPositions.height);
    }

    function addSymbol(symbol) {
        var range = editorRef.current.editor.getSelection(true);
        if (range) {
            editorRef.current.editor.insertText(range.index, symbol);
        }
        setSciDropdownOpen(false);
    }

    return {
        renderSciSymbolDropdown(x, y) {
            return sciDropdownOpen ? 
                <SciSymbolDropdown x={sciDropdownX} y={sciDropdownY} addSymbol={addSymbol} ref={dropdownRef} /> :
                null;
        },
        renderSciSymbolButton() {
            return (
                <button className="vv-sci-symbol-button vv-dropdown-button vv-toolbar-button" ref={sciButtonRef} onClick={displaySciSymbolDropdown}>
                    <FontAwesomeIcon icon='atom' />
                    <FontAwesomeIcon icon='caret-down' />
                </button>
            );
        },
    }
}