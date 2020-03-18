import React from 'react';
import './style/App.css';

import RichTextEditor from './editor/RichTextEditor';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretDown, faBold, faItalic, faUnderline, faStrikethrough, faSuperscript, faSubscript, faCode, faTable, faSquare, faBars, faAtom, faAlignLeft, faAlignRight, faAlignCenter, faAlignJustify, faIndent, faOutdent } from '@fortawesome/free-solid-svg-icons'

library.add(
    faCaretDown, faBold, faItalic, faUnderline, faStrikethrough, faSuperscript, faSubscript, faCode, faTable, faSquare, faBars, faAtom, faAlignLeft, faAlignRight, faAlignCenter, faAlignJustify, faIndent, faOutdent
)

function App() {
  return (
    <div className="App">
        <RichTextEditor />
    </div>
  );
}

export default App;
