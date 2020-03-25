import * as React from 'react';
import * as ReactDOM from 'react-dom';

function App(props) {
    
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <div style={{ display: "flex" }}>
                <div style={{ flex: 12 }}>
                    navbar
                </div>
            </div>
            <div style={{ display: "flex" }}>
                <div style={{ flex: 2 }}>
                    left
                </div>
                <div style={{ flex: 8 }}>
                    main
                </div>
                <div style={{ flex: 2 }}>
                    right
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));