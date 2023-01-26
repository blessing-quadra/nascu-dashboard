import React from "react";

export const Formatter = (num) => {
  // Create our number formatter.
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GMD",

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  return formatter.format(num); /* $2,500.00 */
}


export const NumberFormatter = (subject) => {
  return JSON.stringify(subject.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
}