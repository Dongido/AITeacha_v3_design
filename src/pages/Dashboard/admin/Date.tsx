export const formatDateWithSuffix = (isoString: string): string => {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const getOrdinal = (n: number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const mod100 = n % 100;
    return suffixes[(mod100 - 20) % 10] || suffixes[mod100] || suffixes[0];
  };

  return `${day}${getOrdinal(day)} ${month} ${year}`;
};
