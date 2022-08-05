import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useCallback, useRef, useState } from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { LOAD_KOVAN } from './GraphQL/Queries';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField, InputAdornment, Grid, Pagination, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TransitionsModal from './TransitionsModal';
import { Item, KovanModelRootObject } from './models/Model';
import LoadingSpinner from './LoadingSpinner';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


interface IProps {
  client: ApolloClient<NormalizedCacheObject>;
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}
interface IPagination {
  totalPageCount: number
  currentPage: number
}
const InitialPagination: IPagination = {
  totalPageCount: 1,
  currentPage: 1
}

export const sleep = async (time: number = 500): Promise<void> => {
  return new Promise<void>((resolve) => { setTimeout(resolve, time) });
};



function onlyUnique(value: any, index: any, self: any) {
  return self.indexOf(value) === index;
}

export default function CustomPaginationActionsTable(props: IProps) {
  const [bikes, setBikes] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [ttl, setTtl] = useState<number>(-1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const searchBikeIdRef = useRef<string>("");
  const vehicleFilterRef = useRef<string>("");
  const fillVehicleFilterRef = useRef<boolean>(true);
  const paginationRef = useRef<IPagination>(InitialPagination);
  const [loading, setLoading] = useState<boolean>(false);



  const fetchData = useCallback(async (resetTtl: boolean) => {
    setLoading(true);
    await props.client.cache.reset();
    await sleep();
    const response: KovanModelRootObject = await props.client.query({
      query: LOAD_KOVAN,
      variables: {
        page: paginationRef.current.currentPage.toString(),
        vehicle_type: vehicleFilterRef.current,
        bike_id: searchBikeIdRef.current
      }
    });

    if (response!.data.kovanmodel.total_count < 10) {
      paginationRef.current.totalPageCount = 1;
    } else {
      const mod = (response!.data.kovanmodel.total_count % 10);
      if (mod === 0) {
        paginationRef.current.totalPageCount = response!.data.kovanmodel.total_count / 10;
      }
      else {
        paginationRef.current.totalPageCount = Math.floor(response!.data.kovanmodel.total_count / 10) + 1;
      }
    }
    if (paginationRef.current.currentPage > paginationRef.current.totalPageCount) {
      paginationRef.current.currentPage = paginationRef.current.totalPageCount;
      fetchData(false);
    }

    setBikes(response!.data.kovanmodel.data.bikes.items);
    let vehicleTypesHelper: string[] = [];
    let totalBookingsHelper = 0;
    response.data.kovanmodel.data.bikes.items.forEach((element: Item) => {
      totalBookingsHelper = totalBookingsHelper + element.total_bookings!;
      if (fillVehicleFilterRef.current)
        vehicleTypesHelper.push(element.vehicle_type!);
    });
    setTotalBookings(totalBookingsHelper);
    if (fillVehicleFilterRef.current) {
      vehicleTypesHelper = vehicleTypesHelper.filter(onlyUnique).filter(item => item !== "null");
      setVehicleTypes(vehicleTypesHelper);
      fillVehicleFilterRef.current = false;
    }
    if (resetTtl) {
      setTtl(response!.data.kovanmodel.ttl!);
    };
    setLoading(false);
  }, [props.client]);






  React.useEffect(() => {
    fetchData(true);
  }, [fetchData]);


  const handleCountDown = useCallback(() => {
    if (ttl > 0) {
      setTtl(ttl - 1)
    }
    else if (ttl === 0) {
      fetchData(true);
    }
  }, [fetchData, ttl]);

  React.useEffect(() => {
    let interval: NodeJS.Timer;
    interval = setInterval(() => {
      handleCountDown();
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [handleCountDown, ttl]);


  const handleSearchInputChange = (e: any) => {
    searchBikeIdRef.current = e.target.value;
    setSearch(e.target.value);
    setTimeout(() => {
      fetchData(false);
    }, 1250);
  };

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value !== null) {
      fetchData(false);
    }
    vehicleFilterRef.current = event.target.value;
  };
  const handlePageChange = async (event: React.ChangeEvent<unknown>, page: number) => {
    paginationRef.current.currentPage = page;
    await fetchData(false);
  };

  return (
    <>
      <LoadingSpinner
        message='Initialisation the App'
        key={-1}
        open={loading}
      />
      <Grid container style={{ flexDirection: "row" }}>
        <Grid item xs={12} style={{ height: "50px" }}></Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Grid container style={{ flexDirection: "row" }}>
            <Grid item xs={3}>
              <TextField
                id="input-with-icon-textfield"
                label="Search by bike_id"
                value={search}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="standard"
                onChange={handleSearchInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl sx={{ m: 1, minWidth: 200 }} size="medium">
                <InputLabel id="demo-select-medium">Filter By Vehicle Type</InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={vehicleFilterRef.current}
                  label="Filter By Vehicle Type"
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem key={-10} value={""}>None</MenuItem>
                  {
                    vehicleTypes.map((row: any, index: number) => (
                      <MenuItem key={index} value={row}>{row}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
                <div>Will refresh in: {ttl} seconds.</div>
                <div>Total Bookings Of Listed Bikes: {totalBookings}</div>
                <div><Button variant='outlined' onClick={() => { cookies.remove("authToken") }}>Click Here To Remove The JWT AUTH Token To Test Unauthorized API Call</Button></div>
              </div>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align='center'><h1>data.bikes LIST</h1></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bikes.map((row: any, index: number) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align='center' component="th" scope="row">
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20px" }}>
                        {`${row.bike_id} - ${row.vehicle_type}`}
                        <TransitionsModal
                          client={props.client}
                          bike_id={row.bike_id}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container style={{ flexDirection: "row" }}>
            <Grid item xs={4}></Grid>
            <Grid item xs={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Pagination
                count={paginationRef.current.totalPageCount}
                showFirstButton
                showLastButton
                onChange={handlePageChange}
                page={paginationRef.current.currentPage}
              />
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </>
  );
}
