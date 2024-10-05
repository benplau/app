import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Button,
  Typography,
  TextField,
  Toolbar,
  Divider,
  IconButton,
  FormControl,
  FormLabel,
  FormHelperText,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import { useAppContext } from "../AppContext";
import { useAuth } from "../AuthContext";
import Latex from "react-latex-next";
import LoadingButton from "@mui/lab/LoadingButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "../App.css";

const LatePaymentInterestPage = () => {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Typography variant="h4">Late Payment Interest Calculator</Typography>
      <Divider sx={{ mt: 1 }} />
      <InputForm />
    </Box>
  );
};

const InputForm = () => {
  const { user } = useAuth();
  const { calculations, setCalculations, formData, setFormData, clearAll } =
    useAppContext();
  const [editingTabIndex, setEditingTabIndex] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
    setEditingTabIndex(null);
  };

  const handleInputChange = (tabIndex, name, value) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [tabIndex]: {
        ...prevValues[tabIndex],
        [name]: value,
      },
    }));
  };

  const handleTableChange = (rowIndex, field, value) => {
    setFormData((prevValues) => {
      const updatedFormData = { ...prevValues };
      const updatedTableData = [...updatedFormData[selectedTab].tableData];

      updatedTableData[rowIndex][field] = value;

      updatedFormData[selectedTab] = {
        ...updatedFormData[selectedTab],
        tableData: updatedTableData,
      };

      return updatedFormData;
    });
  };

  const handleTitleChange = (e, tabIndex) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [tabIndex]: {
        ...prevValues[tabIndex],
        title: e.target.value,
      },
    }));
  };

  const fetchLatestInterestRate = async () => {
    setLoadingFetch(true);
    try {
      const payload = {
        startDate: formData[selectedTab].startDate,
        endDate: formData[selectedTab].endDate,
      };
      const response = await fetch("/judgment-debt/fetch-latest-rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      for (const i in data.results) {
        if (i == 0) {
          setFormData((prevValues) => {
            const updatedFormData = { ...prevValues };

            updatedFormData[selectedTab] = {
              ...updatedFormData[selectedTab],
              tableData: [
                {
                  interestRate: data.results[i].interestRate,
                  fromDate: data.results[i].fromDate,
                  toDate: data.results[i].toDate,
                },
              ],
            };

            return updatedFormData;
          });
        } else {
          setFormData((prevValues) => {
            const updatedFormData = { ...prevValues };
            const updatedTableData = [
              ...updatedFormData[selectedTab].tableData,
            ];

            updatedTableData.push({
              interestRate: data.results[i].interestRate,
              fromDate: data.results[i].fromDate,
              toDate: data.results[i].toDate,
            });

            updatedFormData[selectedTab] = {
              ...updatedFormData[selectedTab],
              tableData: updatedTableData,
            };

            return updatedFormData;
          });
        }
      }

      setCurrentDateTime(data.currentDateTime ? data.currentDateTime : "");
    } catch (error) {
      console.error("Error fetching interest rate:", error);
    }
    setLoadingFetch(false);
  };

  const saveCalculation = async (updatedFormData) => {
    const payload = {
      userId: user.id,
      title: updatedFormData.title,
      principal: updatedFormData.principal,
      startDate: updatedFormData.startDate,
      endDate: updatedFormData.endDate,
      tableDatas: updatedFormData.tableData.map((td) => ({
        interestRate: td.interestRate,
        fromDate: td.fromDate,
        toDate: td.toDate,
      })),
      total: updatedFormData.summary.total,
      totalInterest: updatedFormData.summary.totalInterest,
      latexFormulaVariables: updatedFormData.summary.latexFormulaVariables,
      latexFormulaValues: updatedFormData.summary.latexFormulaValues,
    };

    try {
      await fetch("/judgment-debt/records/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Error saving calculation record:", error);
    }
  };

  const addNewCalculation = () => {
    const newId = calculations.length;
    const newTitle = `Calculation ${newId + 1}`;

    setCalculations([...calculations, newId + 1]);
    setFormData({
      ...formData,
      [newId]: {
        title: newTitle,
        principal: "",
        startDate: "",
        endDate: "",
        tableData: [{ interestRate: "", fromDate: "", toDate: "" }],
        summary: {
          total: 0,
          totalInterest: 0,
          latexFormulaVariables: "",
          latexFormulaValues: "",
        },
      },
    });
    setSelectedTab(Object.entries(formData).length);
    setEditingTabIndex(null);
  };

  const removeCalculation = (indexToRemove) => {
    const updatedFormData = { ...formData };
    delete updatedFormData[indexToRemove];
    setFormData(updatedFormData);
    setSelectedTab(Object.entries(updatedFormData).length - 1);
  };

  const addTableRow = () => {
    setFormData((prevValues) => {
      const updatedFormData = { ...prevValues };
      const updatedTableData = [...updatedFormData[selectedTab].tableData];

      updatedTableData.push({ interestRate: "", fromDate: "", toDate: "" });

      updatedFormData[selectedTab] = {
        ...updatedFormData[selectedTab],
        tableData: updatedTableData,
      };

      return updatedFormData;
    });
  };

  const getLatestRate = async () => {
    await fetchLatestInterestRate();
  };

  const calculateResults = () => {
    const result = calculate(formData[selectedTab]);

    if (result.errorMessage) {
      return;
    } else {
      const updatedFormData = {
        ...formData,
        [selectedTab]: {
          ...formData[selectedTab],
          summary: {
            ...formData[selectedTab].summary,
            total: result.total,
            totalInterest: result.totalInterest,
            latexFormulaVariables: result.latexFormulaVariables,
            latexFormulaValues: result.latexFormulaValues,
          },
        },
      };

      setFormData(updatedFormData);

      if (user && user.id) {
        saveCalculation(updatedFormData[selectedTab]);
      }
    }
  };

  const toggleEditTitle = (tabIndex) => {
    setEditingTabIndex(tabIndex);
  };

  const saveTitle = () => {
    setEditingTabIndex(null);
  };

  const getMinDate = () => {
    return formData[selectedTab]?.startDate || "";
  };

  const getMaxDate = () => {
    return formData[selectedTab]?.endDate || "";
  };

  const handleClearAll = () => {
    clearAll(selectedTab);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Tabs with Add button */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          {Object.entries(formData).map(([key, value]) => (
            <Tab key={key} label={value.title} />
          ))}
        </Tabs>
        <IconButton onClick={addNewCalculation}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>

      {/* Dynamic Input fields based on selected tab */}
      {Object.entries(formData).map(([key, value], index) => {
        return (
          selectedTab == index && (
            <Box key={key} sx={{ marginTop: 1 }}>
              {/* Page Header with Title and Trash Icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                {editingTabIndex == key ? (
                  <>
                    <TextField
                      value={value.title || ""}
                      onChange={(e) => handleTitleChange(e, key)}
                      size="small"
                      sx={{ marginRight: 1 }}
                    />
                    <Button
                      onClick={saveTitle}
                      size="small"
                      variant="contained"
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="h6" sx={{ marginRight: 1 }}>
                      {value.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => toggleEditTitle(key)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {Object.entries(formData).length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => removeCalculation(key)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </>
                )}
              </Box>

              {/* Input Fields */}
              <Box sx={{ marginTop: 2, width: "70%" }}>
                <Grid
                  container
                  columnSpacing={2}
                  rowSpacing={2}
                  sx={{ width: 700 }}
                >
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <FormLabel sx={{ color: "black" }}>
                        Outstanding Amount
                      </FormLabel>
                      <TextField
                        type="number"
                        fullWidth
                        size="small"
                        value={value.principal || ""}
                        onChange={(e) =>
                          handleInputChange(key, "principal", e.target.value)
                        }
                      />
                      <FormHelperText sx={{ marginLeft: 0.5 }}>
                        Enter the amount of the outstanding payment
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}></Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <FormLabel sx={{ color: "black" }}>
                        Payment Due Date
                      </FormLabel>
                      <TextField
                        type="date"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                        value={value.startDate || ""}
                        onChange={(e) =>
                          handleInputChange(key, "startDate", e.target.value)
                        }
                      />
                      <FormHelperText sx={{ marginLeft: 0.5 }}>
                        Enter the date when the payment should have been made
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <FormLabel sx={{ color: "black" }}>
                        Intended Payment Date
                      </FormLabel>
                      <TextField
                        type="date"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                        value={value.endDate || ""}
                        onChange={(e) =>
                          handleInputChange(key, "endDate", e.target.value)
                        }
                      />
                      <FormHelperText sx={{ marginLeft: 0.5 }}>
                        Enter the date when the outstanding payment will be paid
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Table for interest rates */}
                  <Grid
                    item
                    xs={2}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      marginBottom: -2,
                      marginTop: 1,
                    }}
                  >
                    <LoadingButton
                      color="secondary"
                      onClick={getLatestRate}
                      loading={loadingFetch}
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        minWidth: 150,
                      }}
                    >
                      Get Latest Rates
                    </LoadingButton>
                  </Grid>

                  <Grid
                    item
                    xs={2}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      marginBottom: -2.3,
                      marginLeft: -1.4,
                    }}
                  >
                    {currentDateTime && (
                      <FormHelperText
                        sx={{ whiteSpace: "nowrap", marginLeft: "60px" }}
                      >
                        Last checked: {currentDateTime}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ width: 685 }}>
                      <Table aria-label="editable table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Interest Rate (% per annum)</TableCell>
                            <TableCell>From Date</TableCell>
                            <TableCell>To Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {value?.tableData?.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              <TableCell>
                                <TextField
                                  type="number"
                                  size="small"
                                  value={row.interestRate}
                                  onChange={(e) =>
                                    handleTableChange(
                                      rowIndex,
                                      "interestRate",
                                      e.target.value
                                    )
                                  }
                                  fullWidth
                                />
                              </TableCell>

                              <TableCell>
                                <TextField
                                  type="date"
                                  inputProps={{
                                    min: getMinDate(),
                                    max: getMaxDate(),
                                  }}
                                  size="small"
                                  value={row.fromDate}
                                  onChange={(e) =>
                                    handleTableChange(
                                      rowIndex,
                                      "fromDate",
                                      e.target.value
                                    )
                                  }
                                  fullWidth
                                />
                              </TableCell>

                              <TableCell>
                                <TextField
                                  type="date"
                                  inputProps={{
                                    min: getMinDate(),
                                    max: getMaxDate(),
                                  }}
                                  size="small"
                                  value={row.toDate}
                                  onChange={(e) =>
                                    handleTableChange(
                                      rowIndex,
                                      "toDate",
                                      e.target.value
                                    )
                                  }
                                  fullWidth
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  <Grid
                    item
                    xs={7}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      marginTop: -2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={addTableRow}
                      sx={{
                        textTransform: "none",
                        fontSize: "20px",
                        width: "10px",
                        height: "30px",
                      }}
                    >
                      +
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )
        );
      })}

      {/* Calculate & Clear All Buttons */}
      <Grid container spacing={2} sx={{ marginTop: 5 }}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={calculateResults}
            sx={{ textTransform: "none" }}
            size="large"
          >
            Calculate
          </Button>
          <Button
            variant="outlined"
            onClick={handleClearAll}
            sx={{ textTransform: "none", ml: 3 }}
            size="large"
          >
            Clear All
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ marginTop: 1 }} />

      {/* Results Section */}
      <Box sx={{ marginTop: 2, marginBottom: 20 }}>
        <Card sx={{ width: 700, marginLeft: 0, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="body1">
              <strong>Total: </strong>$
              {formData[selectedTab]?.summary?.total
                ? formData[selectedTab].summary.total
                : 0}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>Total Interest: </strong>$
              {formData[selectedTab]?.summary?.totalInterest
                ? formData[selectedTab].summary.totalInterest
                : 0}
            </Typography>
          </CardContent>
        </Card>
        <Box sx={{ whiteSpace: "nowrap" }}>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>
              Calculation Formula:
              {"\u00A0\u00A0\u00A0"}
            </strong>
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, ml: 2 }}>
            <Latex>{"$A = P~(1 + rt)$"}</Latex>
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, ml: 2 }}>
            <Latex>
              {formData[selectedTab]?.summary?.latexFormulaVariables
                ? formData[selectedTab].summary.latexFormulaVariables
                : ""}
            </Latex>
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, ml: 2 }}>
            <Latex>
              {formData[selectedTab]?.summary?.latexFormulaValues
                ? formData[selectedTab].summary.latexFormulaValues
                : ""}
            </Latex>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

function calculate(formData) {
  let results = {
    total: 0,
    totalInterest: 0,
    latexFormulaVariables: "",
    latexFormulaValues: "",
    errorMessage: "",
  };
  const formDataCopy = {
    ...formData,
    tableData: formData.tableData.map((item) => ({ ...item })),
    summary: { ...formData.summary },
  };
  let { principal, startDate, endDate, tableData } = formDataCopy;

  if (tableData.length > 1) {
    tableData = tableData.filter((item) => item.interestRate !== "");
  }

  if (!formData.startDate || !formData.endDate) {
    return { ...results, errorMessage: "empty start/end date" };
  } else if (new Date(startDate) > new Date(endDate)) {
    results.total = formData.principal;
    results.totalInterest = 0;
    results.latexFormula = "";
    results.errorMessage = "start date is after end date";
    return results;
  } else if (tableData.some((item) => !item.fromDate || !item.toDate)) {
    if (tableData?.length > 1) {
      return {
        ...results,
        errorMessage: "empty from/to date while more than one interest rate",
      };
    } else {
      tableData[0].fromDate = startDate;
      tableData[0].toDate = endDate;
    }
  }
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  endDate.setDate(endDate.getDate() - 1);
  tableData = tableData
    .map((item) => ({
      ...item,
      fromDate: new Date(item.fromDate),
      toDate: new Date(item.toDate),
    }))
    .sort((a, b) => a.fromDate - b.fromDate);

  tableData[tableData.length - 1].toDate.setDate(
    tableData[tableData.length - 1].toDate.getDate() - 1
  );

  for (let i = 0; i < tableData.length - 1; i++) {
    const currentRange = tableData[i];
    const nextRange = tableData[i + 1];

    if (currentRange.toDate >= nextRange.fromDate) {
      return {
        ...results,
        errorMessage: "overlapped date ranges found on interest rate table",
      };
    }
  }

  if (
    tableData[0].fromDate > startDate ||
    tableData[tableData.length - 1].toDate < endDate
  ) {
    return {
      ...results,
      errorMessage:
        "interest rates total date range does not cover the start to end date range",
    };
  }

  results.latexFormulaVariables = "$A = P";
  results.latexFormulaValues = `$A = ${principal}`;

  tableData.forEach((item, index) => {
    let periodDays = (item.toDate - item.fromDate) / (1000 * 3600 * 24) + 1;
    let periodInterestRate = item.interestRate / 100;
    let periodInterest = principal * periodInterestRate * (periodDays / 365);

    results.totalInterest += Number(periodInterest);

    results.latexFormulaVariables += `~+~(P~\\times~r_{${String(
      index + 1
    )}}~\\times~\\frac{t_{${String(index + 1)}}}{365})`;

    results.latexFormulaValues += `~+~(${principal}~\\times~${periodInterestRate.toFixed(
      5
    )}~\\times~\\frac{${periodDays}}{365})`;
  });
  results.total = Number(principal) + results.totalInterest;
  results.latexFormulaVariables += "$";
  results.latexFormulaValues += "$";

  results.total = results.total.toFixed(5);
  results.totalInterest = results.totalInterest.toFixed(5);

  return results;
}

export default LatePaymentInterestPage;
