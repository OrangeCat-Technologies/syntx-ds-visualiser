import * as React from "react";
import { TableVirtuoso } from "react-virtuoso";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box } from "@mui/system";

import { useTheme } from "@mui/material/styles";
import { alpha, Paper, Tooltip, CircularProgress, Fade } from "@mui/material";

import { Type } from "../data/types";
import { getIconFromType } from "./ViewUtils";

import { IconButton, TableSortLabel, Typography } from "@mui/material";

import _ from "lodash";
import { FieldSource } from "../components/ComponentType";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import CasinoIcon from "@mui/icons-material/Casino";
import { getUrls } from "../app/utils";

export interface ColumnDef {
  id: string;
  label: string;
  dataType: Type;
  minWidth?: number;
  width?: number;
  align?: "right";
  format?: (value: number) => string | JSX.Element;
  source: FieldSource;
}

interface SelectableDataGridProps {
  tableId: string;
  tableName: string;
  rows: any[];
  rowCount: number;
  virtual: boolean;
  columnDefs: ColumnDef[];
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: "asc" | "desc",
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export const SelectableDataGrid: React.FC<SelectableDataGridProps> = ({
  tableId,
  rows,
  tableName,
  columnDefs,
  rowCount,
  virtual,
}) => {
  const [orderBy, setOrderBy] = React.useState<string | undefined>(undefined);
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");

  let theme = useTheme();

  const [rowsToDisplay, setRowsToDisplay] = React.useState<any[]>(rows);

  // Initialize as true to cover the initial mount delay
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Clear loading state after first render
  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (orderBy && !isLoading) {
      setRowsToDisplay(rows.slice().sort(getComparator(order, orderBy)));
    } else {
      setRowsToDisplay(rows);
    }
  }, [rows, order, orderBy]);

  const TableComponents = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
      <TableContainer {...props} ref={ref} />
    )),
    Table: (props: any) => <Table {...props} />,
    TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableHead {...props} ref={ref} className="table-header-container" />
    )),
    TableRow: (props: any) => {
      const index = props["data-index"];
      return (
        <TableRow
          {...props}
          style={{
            backgroundColor:
              index % 2 == 0
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.02)",
          }}
        />
      );
    },
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  };

  const fetchVirtualData = (
    sortByColumnIds: string[],
    sortOrder: "asc" | "desc"
  ) => {
    // Set loading to true when starting the fetch
    setIsLoading(true);

    let message =
      sortByColumnIds.length > 0
        ? {
            table: tableId,
            size: 1000,
            method: sortOrder === "asc" ? "head" : "bottom",
            order_by_fields: sortByColumnIds,
          }
        : {
            table: tableId,
            size: 1000,
            method: "random",
          };

    // Use the SAMPLE_TABLE endpoint with appropriate ordering
    fetch(getUrls().SAMPLE_TABLE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setRowsToDisplay(data.rows);
        }
        // Set loading to false when done
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sorted table data:", error);
        // Ensure loading is set to false even on error
        setIsLoading(false);
      });
  };

  return (
    <Box
      className="table-container table-container-small"
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        "& .MuiTableCell-root": {
          fontSize: 12,
          maxWidth: "120px",
          py: "2px",
          cursor: "default",
          overflow: "clip",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            padding: "8px",
            height: "100%",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          }}
        >
          <CircularProgress size={24} sx={{ mr: 1, color: "lightgray" }} />
          <Typography variant="body2" color="text.secondary">
            Loading ...
          </Typography>
        </Box>
      )}
      <Fade in={!isLoading} timeout={{ appear: 300, enter: 300, exit: 2000 }}>
        <Box sx={{ flex: "1 1", display: "flex", flexDirection: "column" }}>
          <TableVirtuoso
            style={{ flex: "1 1" }}
            data={rowsToDisplay}
            components={TableComponents}
            fixedHeaderContent={() => {
              return (
                <TableRow
                  key="header-fixed"
                  style={{
                    paddingRight: 0,
                    marginRight: "17px",
                    height: "24px",
                  }}
                >
                  {columnDefs.map((columnDef, index) => {
                    let backgroundColor = "white";
                    let borderBottomColor = theme.palette.primary.main;
                    if (columnDef.source == "custom") {
                      backgroundColor = alpha(theme.palette.custom.main, 0.05);
                      borderBottomColor = theme.palette.custom.main;
                    } else {
                      backgroundColor = "white";
                      borderBottomColor = theme.palette.primary.main;
                    }

                    return (
                      <TableCell
                        className="data-view-header-cell"
                        key={columnDef.id}
                        align={columnDef.align}
                        sx={{
                          p: 0,
                          minWidth: columnDef.minWidth,
                          width: columnDef.width,
                        }}
                      >
                        <Tooltip title={`${columnDef.label}`}>
                          <Box
                            className="data-view-header-container"
                            sx={{
                              backgroundColor,
                              borderBottomColor,
                              borderBottomWidth: "2px",
                              borderBottomStyle: "solid",
                            }}
                          >
                            <TableSortLabel
                              className="data-view-header-title"
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%",
                              }}
                              active={orderBy === columnDef.id}
                              direction={
                                orderBy === columnDef.id ? order : "asc"
                              }
                              onClick={() => {
                                let newOrder: "asc" | "desc" = "asc";
                                let newOrderBy: string | undefined =
                                  columnDef.id;
                                if (
                                  orderBy === columnDef.id &&
                                  order === "asc"
                                ) {
                                  newOrder = "desc";
                                } else if (
                                  orderBy === columnDef.id &&
                                  order === "desc"
                                ) {
                                  newOrder = "asc";
                                  newOrderBy = undefined;
                                } else {
                                  newOrder = "asc";
                                }

                                setOrder(newOrder);
                                setOrderBy(newOrderBy);

                                if (virtual) {
                                  fetchVirtualData(
                                    newOrderBy ? [newOrderBy] : [],
                                    newOrder
                                  );
                                }
                              }}
                            >
                              <span
                                role="img"
                                style={{
                                  fontSize: "inherit",
                                  padding: "2px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                {getIconFromType(columnDef.dataType)}
                              </span>
                              <Typography className="data-view-header-name">
                                {columnDef.label}
                              </Typography>
                            </TableSortLabel>
                          </Box>
                        </Tooltip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            }}
            itemContent={(rowIndex, data) => {
              return (
                <>
                  {columnDefs.map((column, colIndex) => {
                    let backgroundColor = "white";
                    if (column.source == "custom") {
                      backgroundColor = alpha(theme.palette.custom.main, 0.05);
                    } else {
                      backgroundColor = "rgba(255,255,255,0.05)";
                    }

                    return (
                      <TableCell
                        key={`col-${colIndex}-row-${rowIndex}`}
                        sx={{ backgroundColor }}
                        align={column.align || "left"}
                      >
                        {column.format
                          ? column.format(data[column.id])
                          : data[column.id]}
                      </TableCell>
                    );
                  })}
                </>
              );
            }}
          />
        </Box>
      </Fade>
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "row",
          position: "absolute",
          bottom: 6,
          right: 12,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mx: 1 }}>
          <Typography
            sx={{ display: "flex", alignItems: "center", fontSize: "12px" }}
          >
            {virtual && <CloudQueueIcon sx={{ fontSize: 16, mr: 1 }} />}
            {`${rowCount} rows`}
          </Typography>
          {virtual && rowCount > 10000 && (
            <Tooltip title="view 10000 random rows from this table">
              <IconButton
                size="small"
                color="primary"
                sx={{ marginRight: 1 }}
                onClick={() => {
                  fetchVirtualData([], "asc");
                }}
              >
                <CasinoIcon
                  sx={{
                    fontSize: 18,
                    "&:hover": {
                      transform: "rotate(180deg)",
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
