import React from 'react';
import './style/App.css';

import RichTextEditor from './editor/RichTextEditor';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretDown, faBold, faItalic, faUnderline, faStrikethrough, faSuperscript, faSubscript, faCode, faTable, faSquare } from '@fortawesome/free-solid-svg-icons'

library.add(
    faCaretDown, faBold, faItalic, faUnderline, faStrikethrough, faSuperscript, faSubscript, faCode, faTable, faSquare
)

function App() {
  return (
    <div className="App">
        <RichTextEditor />
    </div>
  );
}

export default App;
