import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';

export interface Props {
    message?: string;
    open?: boolean
}

export default function LoadingSpinner({ message = 'Loading...', open = false }: Props) {
    return (
        <div style={{ zIndex: 100, position: "absolute" }}>
            <Backdrop open={open} invisible={false}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                    <CircularProgress
                        color='primary'
                        size={100}
                    />
                    <Typography variant='h4' sx={{ marginTop: '20px' }}></Typography>
                </Box>
            </Backdrop>
        </div>
    );
}