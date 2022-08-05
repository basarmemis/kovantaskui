import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { LOAD_BIKEDETAIL } from './GraphQL/Queries';
import { Item } from './models/Model';
import { KovanBikeDetailModelRootObject } from './models/Model3';
import LoadingSpinner from './LoadingSpinner';
import { sleep } from './CustomPaginationActionsTable';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 750,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


interface IProps {
    client: ApolloClient<NormalizedCacheObject>
    bike_id: string
}

export default function TransitionsModal(props: IProps) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState<boolean>(false);




    const handleOpen = async () => {
        await fetchDetails();
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const [bike, setBike] = React.useState<Item | undefined>(undefined);


    const fetchDetails = async () => {
        setLoading(true);
        await sleep();
        const response: KovanBikeDetailModelRootObject = await props.client.query({
            query: LOAD_BIKEDETAIL,
            variables: {
                bike_id: props.bike_id
            }
        });
        if (response !== null)
            setBike(response!.data.kovanbikedetailmodel.data.bike);
        setLoading(false);
    };

    return (
        <div>
            <LoadingSpinner
                message='Initialisation the App'
                key={-1}
                open={loading}
            />
            <Button onClick={handleOpen}>Details</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        {
                            bike ? <div>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align='center'><h1>DETAILS</h1></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow
                                            >
                                                <TableCell align='center' component="th" scope="row">
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20px", fontSize: "20px" }}>
                                                        Bike Id : {bike.bike_id}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align='center' component="th" scope="row">
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20px", fontSize: "20px" }}>
                                                        Lat : {bike.lat}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align='center' component="th" scope="row">
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20px", fontSize: "20px" }}>
                                                        Lon : {bike.lon}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align='center' component="th" scope="row">
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20px", fontSize: "20px" }}>
                                                        Is Reserved? : {bike.is_reserved!.toString()}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align='center' component="th" scope="row">
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20px", fontSize: "20px" }}>
                                                        Is Disabled? : {bike.is_disabled!.toString()}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align='center' component="th" scope="row">
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20px", fontSize: "20px" }}>
                                                        Vehicle Type : {bike.vehicle_type}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align='center' component="th" scope="row">
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20px", fontSize: "20px" }}>
                                                        Total Bookings : {bike.total_bookings}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align='center' component="th" scope="row">
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20px", fontSize: "20px" }}>
                                                        Android : {bike.android}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align='center' component="th" scope="row">
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20px", fontSize: "20px" }}>
                                                        IOS : {bike.ios}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </div> :
                                <div>
                                </div>
                        }
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}