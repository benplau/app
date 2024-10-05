import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const RelevantInformationPage = () => {
  const [loading, setLoading] = useState(false);
  const [interestRatesData, setInterestRatesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await axios.get("/judgment-debt/interest-rates/get");
        console.log(response);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setInterestRatesData(response.data);
      } catch (err) {
        console.log("Error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container component="main" sx={{ px: 20, py: 8, marginTop: 8 }}>
      <Grid item xs={12} component={Paper} elevation={6} square>
        <Box sx={{ my: 4, mx: 2 }}>
          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="50vh"
            >
              <CircularProgress />
            </Box>
          )}

          {!loading && (
            <TableContainer
              component={Paper}
              sx={{ overflowX: "auto", maxWidth: "100%" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: "50%" }}>
                      <strong>
                        Interest Rates on Judgment Debts (% per annum)
                      </strong>
                    </TableCell>
                    <TableCell align="center" sx={{ width: "50%" }}>
                      <strong>Effective Date</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                {!loading && interestRatesData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="h6">No records available</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableBody>
                    {interestRatesData.map((data) => (
                      <TableRow key={data.id}>
                        <TableCell align="center" sx={{ width: "50%" }}>
                          {data.interestRate ? data.interestRate : "-"}
                        </TableCell>
                        <TableCell align="center" sx={{ width: "50%" }}>
                          {data.effectiveDate ? data.effectiveDate : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default RelevantInformationPage;
