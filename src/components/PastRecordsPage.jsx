import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../AuthContext";

const columnWidths = {
  title: 120,
  total: 120,
  totalInterest: 140,
  principal: 120,
  paymentDueDate: 170,
  intendedPaymentDate: 190,
  interestRates: 260,
  createdDate: 200,
};

const totalMinWidth = Object.values(columnWidths).reduce(
  (sum, width) => sum + width,
  0
);

const PastRecordsPage = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "/judgment-debt/records/get/" + user.id
        );
        console.log(response);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setRecords(response.data);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getInterestRates = (datas) => {
    let result = "";

    datas.forEach((item, index) => {
      result +=
        item.interestRate +
        "%  ( " +
        item.fromDate +
        " - " +
        item.toDate +
        " )";
      if (index != datas.length - 1) {
        result += "\n";
      }
    });

    return result.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <Grid container component="main" sx={{ px: 4, py: 4, marginTop: 8 }}>
      <Box sx={{ my: 4, mx: 2, pr: 2 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Past Calculation Records
        </Typography>

        {error && (
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        )}

        <TableContainer
          component={Paper}
          sx={{ overflowX: "auto", maxWidth: "100%" }}
        >
          <Table
            stickyHeader
            sx={{ minWidth: `${totalMinWidth}px`, tableLayout: "fixed" }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: columnWidths.title }}>
                  <strong>Title</strong>
                </TableCell>
                <TableCell sx={{ width: columnWidths.total }} align="left">
                  <strong>Total ($)</strong>
                </TableCell>
                <TableCell
                  sx={{ width: columnWidths.totalInterest }}
                  align="left"
                >
                  <strong>Total Interest ($)</strong>
                </TableCell>
                <TableCell sx={{ width: columnWidths.principal }} align="left">
                  <strong>Principal ($)</strong>
                </TableCell>
                <TableCell sx={{ width: columnWidths.paymentDueDate }}>
                  <strong>Payment Due Date</strong>
                </TableCell>
                <TableCell sx={{ width: columnWidths.intendedPaymentDate }}>
                  <strong>Intended Payment Date</strong>
                </TableCell>
                <TableCell sx={{ width: columnWidths.interestRates }}>
                  <strong>Interest Rates</strong>
                </TableCell>
                <TableCell sx={{ width: columnWidths.createdDate }}>
                  <strong>Calculation Created Date</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            {loading && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="10vh"
                  >
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {!loading && records.length === 0 && !error ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="h6">No records available</Typography>
                </TableCell>
              </TableRow>
            ) : (
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell sx={{ minWidth: columnWidths.title }}>
                      {record.title ? record.title : "-"}
                    </TableCell>
                    <TableCell
                      sx={{ minWidth: columnWidths.total }}
                      align="left"
                    >
                      {record.total}
                    </TableCell>
                    <TableCell
                      sx={{ minWidth: columnWidths.totalInterest }}
                      align="left"
                    >
                      {record.totalInterest ? record.totalInterest : "-"}
                    </TableCell>
                    <TableCell
                      sx={{ minWidth: columnWidths.principal }}
                      align="left"
                    >
                      {record.principal ? record.principal : "-"}
                    </TableCell>
                    <TableCell sx={{ minWidth: columnWidths.paymentDueDate }}>
                      {record.startDate ? record.startDate : "-"}
                    </TableCell>
                    <TableCell
                      sx={{ minWidth: columnWidths.intendedPaymentDate }}
                    >
                      {record.endDate ? record.endDate : "-"}
                    </TableCell>
                    <TableCell sx={{ minWidth: columnWidths.interestRates }}>
                      {record.tableDatas
                        ? getInterestRates(record.tableDatas)
                        : ""}
                    </TableCell>
                    <TableCell sx={{ minWidth: columnWidths.createdDate }}>
                      {record.createdDate ? record.createdDate : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Box>
    </Grid>
  );
};

export default PastRecordsPage;
