import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";

const INPUT_TYPES = { email: "email", date: "date" };
const NUMERIC_KINDS = ["digits", "phone"];

/**
 * Renderiza un campo del formulario de inscripción TSP a partir de su configuración
 * usando los estilos definidos en el ThemeProvider activo (tspTheme).
 */
export const InscriptionField = ({ field, value, error, disabled, onChange, onBlur }) => {
  if (field.kind === "switch") {
    return (
      <FormControl fullWidth>
        <FormControlLabel
          control={
            <Switch
              name={field.name}
              checked={Boolean(value)}
              onChange={onChange}
              disabled={disabled}
              color="primary"
            />
          }
          label={field.label}
        />
        {field.helper && <FormHelperText sx={{ mx: 0 }}>{field.helper}</FormHelperText>}
      </FormControl>
    );
  }

  const isSelect = field.kind === "select";
  const isTextarea = field.kind === "textarea";

  return (
    <TextField
      select={isSelect}
      fullWidth
      required={field.required}
      type={INPUT_TYPES[field.kind] || "text"}
      label={field.label}
      name={field.name}
      placeholder={field.placeholder}
      value={value ?? ""}
      onChange={onChange}
      onBlur={isSelect ? undefined : onBlur}
      disabled={disabled}
      error={Boolean(error)}
      helperText={error || field.helper || " "}
      multiline={isTextarea}
      minRows={isTextarea ? 2 : undefined}
      autoComplete={field.autoComplete || "off"}
      slotProps={{
        htmlInput: {
          maxLength: isSelect ? undefined : field.kind === "phone" ? 15 : field.max,
          inputMode: NUMERIC_KINDS.includes(field.kind) ? "numeric" : undefined,
        },
        inputLabel: field.kind === "date" ? { shrink: true } : undefined,
      }}
      sx={{ "& .MuiFormHelperText-root": { mx: 0 } }}
    >
      {isSelect && !field.required && (
        <MenuItem value="">
          <em>Sin especificar</em>
        </MenuItem>
      )}
      {isSelect &&
        field.options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  );
};

