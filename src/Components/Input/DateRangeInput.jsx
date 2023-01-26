import * as React from 'react';
import { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker, DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';

export default function BasicDateRangePicker() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>([null, null]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={{ start: 'Check-in', end: 'Check-out' }}
    >
      <DateRangePicker
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      />
    </LocalizationProvider>
  );
}