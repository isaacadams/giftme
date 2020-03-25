import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Gifts } from './Components/AddGift';

function App(props) {
    
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <div style={{ display: "flex" }}>
                <div style={{ flex: 12 }}>
                    navbar
                </div>
            </div>
            <div style={{ display: "flex", height: "100%" }}>
                <div style={{ flex: 2 }}>
                    left
                </div>
                <div style={{ flex: 8 }}>
                    <div style={{ display: "flex", height: "500px" }}>
                        <div style={{ alignSelf: "center" }} >
                            <Gifts addGift={s => console.log(s)} />
                        </div>
                    </div>
                </div>
                <div style={{ flex: 2 }}>
                    right
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));