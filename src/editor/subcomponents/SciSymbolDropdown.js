import React, { useState, useRef, forwardRef } from 'react';
import { useDropdownBehavior } from './Dropdown';
import omegaIcon from '../icons/omega.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SYMBOL_LIST = [
    { name: 'alpha', symbol: 'α' },
    { name: 'beta', symbol: 'β' }, 
    { name: 'pi', symbol: 'π' }, 
]

const SciSymbolDropdown = forwardRef(function (props, ref) {
    const { x, y } = props;
    const [ searchTerm, setSearchTerm ] = useState('');

    return <div style={{ left: x, top: y }} className='sci-dropdown quill-dropdown' ref={ref}>
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}></input>
        <div>
            { 
                SYMBOL_LIST.map(s => {
                    return s.name.includes(searchTerm) ? 
                        <div className='sci-dropdown-item quill-dropdown-item' 
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

export function useSciSymbolDropdown({ editor, containerRef }) {
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
        var range = editor.current.getSelection(true);
        if (range) {
            editor.current.insertText(range.index, symbol);
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
                <button className="ql-sci-symbol ql-dropdown-button" ref={sciButtonRef} onClick={displaySciSymbolDropdown}>
                    <img src={omegaIcon} alt='scientific symbols' />
                    <FontAwesomeIcon icon='caret-down' />
                </button>
            );
        },
    }
}