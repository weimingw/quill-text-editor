import { useRef, useEffect } from 'react';

import './style/Dropdown.scss';

export function useDropdownBehavior({ buttonRef, setDropdownOpen }) {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const callback = e => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) && 
                buttonRef.current && !buttonRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            return true;
        };

        const listener = window.addEventListener('click', callback);
        return () => {
            window.removeEventListener('click', listener);
        }
    }, [ buttonRef, setDropdownOpen ]);

    return {
        dropdownRef
    };
}

/**
 * Makes it so that the button automatically sets the label based on the formatting in a new selection
 * @param {*} editorRef 
 * @param {Array} options all possible options under the dropdown (e.g. FontDropdown#FONTS)
 * @param {String} key key that the button is responsible for, as found under Quill's formats (e.g. font-family, font-size)
 * @param {Function} setValue setter function for the state that the button is responsible for
 */
export function useDropdownButtonBehavior({ editorRef, options, key, setValue }) {
    useEffect(() => {
        if (editorRef.current) {
            const editorInstance = editorRef.current.editor;
            const callback = function(range) {
                if (range) {
                    const value = editorInstance.getFormat()[key];
                    setValue(options.find(f => value === f.value) || options[0]);
                }
            };

            if (editorRef.current.editor) {
                editorInstance.on('selection-change', callback);
                return () => editorInstance.off('selection-change', callback);
            }
        }

        // eslint complains about ref.current not updating component, 
        // and yet the effect won't re-run with a value unless I use ref.current
        // eslint-disable-next-line
    }, [ editorRef.current, options, key, setValue ]);
}