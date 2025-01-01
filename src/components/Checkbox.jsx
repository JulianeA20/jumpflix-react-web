import Checkbox from "@mui/material/Checkbox";

function CustomCheckbox() {
  return (
    <Checkbox
      sx={{
        color: "white",
        "&.Mui-checked": { color: "#b31b1b" },
        "&.MuiSvgIcon-root": { fontSize: 14, borderRadius: "50%" },
      }}
    />
  );
}

export default CustomCheckbox;
