// CommissionsContainer.jsx
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Commissions from "../views/Commissions/Commissions";
import CommissionsNavBar from "../components/commissionsNavBar/commissionsNavBar";
import { Divider } from "@mui/material";
import { styled } from "@mui/system";
import { commissionsPerProfessional } from "../assets/functions/commissionsPerProfessional";

// Divider personalizado (igual que en Dashboard)
const CustomDivider = styled(Divider)({
  borderColor: "#0b0b0a", 
  border: "solid 1px"
});

const CommissionsContainer = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDatePick, setSelectedDatePick] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  useEffect(() => {
    const today = dayjs();
    setSelectedDate(today.format("YYYY-MM-DD"));
    setSelectedDatePick(today);
    setSelectedMonth("00");
    setSelectedFilter("todo");
  }, []);

  const handleDateChange = (date) => {
    const formatted = dayjs(date).format("YYYY-MM-DD");
    setSelectedDate(formatted);
    setSelectedDatePick(date);
    setSelectedMonth("00");
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const renderFilterCommissions = (commissions) => {
    if (selectedFilter === "Liquidado") {
      return commissions.filter((c) => c.paid === true);
    } else if (selectedFilter === "no-liquidado") {
      return commissions.filter((c) => c.paid === false);
    } else {
      return commissions;
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", height: 'fit-content' }}>
        <CommissionsNavBar
          selectedDate={selectedDatePick}
          onDateChange={handleDateChange}
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
        />
        <CustomDivider />
      </div>
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <Commissions
          selectedDate={selectedDate}
          selectedMonth={selectedMonth}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          renderFilterCommissions={renderFilterCommissions}
        />
      </div>
    </div>
  );
};

export default CommissionsContainer;
