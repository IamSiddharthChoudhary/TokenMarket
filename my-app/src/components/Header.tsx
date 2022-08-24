import {useEthers} from "@usedapp/core"
import Button  from 'react-bootstrap/Button';

export const Header = () => {
    // const classes = useStyles()

    const { account, activateBrowserWallet, deactivate } = useEthers()

    const isConnected = account !== undefined

    return (
        <div >
            
            {isConnected ? (
                <Button variant="outline-danger" onClick={deactivate}>
                    Disconnect
                </Button>
            ) : (
                <Button
                    variant="success"
                    onClick={() => activateBrowserWallet()}
                >
                    Connect
                </Button>
            )}
        </div>
    )
}