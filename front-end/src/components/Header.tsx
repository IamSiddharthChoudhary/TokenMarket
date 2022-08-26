import { useEthers } from "@usedapp/core";
import {Button, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme)=>({
    container:{
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-end",
        gap : theme.spacing(1)
    }
}))

export const Header = () => {
    const classes = useStyles()
    const {account, activateBrowserWallet, deactivate} = useEthers()

    const isConnected = account !== undefined
    
    return (
        <div className={classes.container}>
            <div>
                {isConnected ?(
                    <Button variant="outlined" onClick={deactivate}>
                        Disconnect
                    </Button>
                ):(
                    <Button color="primary" variant="outlined" onClick={activateBrowserWallet}>
                        Connect
                    </Button>
                )}
            </div>
        </div>
    )
}