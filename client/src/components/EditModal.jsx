import React from "react";
import {
Dialog,
DialogTitle,
DialogContent,
DialogActions,
Button,
TextField,
MenuItem,
IconButton,
Paper,
Stack,
Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/system";

const EditModal = ({ open, schema = {}, formData = {}, onChange, onSave, onCancel, services = [] }) => {
if (!formData) return null;

const handleAddItem = (fieldKey, itemSchema) => {
const newItem = Object.keys(itemSchema).reduce((acc, k) => ({ ...acc, [k]: "" }), {});
const updatedArray = [...(formData[fieldKey] || []), newItem];
onChange({ ...formData, [fieldKey]: updatedArray });
};

const handleDeleteItem = (fieldKey, index) => {
const updatedArray = [...formData[fieldKey]];
updatedArray.splice(index, 1);
onChange({ ...formData, [fieldKey]: updatedArray });
};

const handleItemFieldChange = (fieldKey, index, subKey, value) => {
const updatedArray = [...formData[fieldKey]];
const updatedItem = { ...updatedArray[index] }; // clonar el objeto del item
updatedItem[subKey] = value;
updatedArray[index] = updatedItem;
onChange({ ...formData, [fieldKey]: updatedArray });
};

const renderField = (fieldKey, fieldSchema) => {
const value = formData[fieldKey] ?? "";


if (fieldSchema.type === "text" || fieldSchema.type === "number") {
  return (
    <TextField
      key={fieldKey}
      label={fieldSchema.label ?? fieldKey}
      name={fieldKey}
      type={fieldSchema.type}
      value={value}
      onChange={(e) => onChange({ ...formData, [fieldKey]: e.target.value })}
      fullWidth
      margin="normal"
    />
  );
}

if (fieldSchema.type === "array") {
  const items = Array.isArray(value) ? value : [];
  const itemSchema = fieldSchema.itemFields || {};

  return (
    <Box key={fieldKey} sx={{ mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="subtitle1">{fieldSchema.label ?? fieldKey}</Typography>
        <IconButton color="primary" onClick={() => handleAddItem(fieldKey, itemSchema)} size="small">
          <AddIcon />
        </IconButton>
      </Stack>

      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No hay elementos.</Typography>
      ) : (
        items.map((item, idx) => (
          <Paper key={idx} variant="outlined" sx={{ p: 2, mb: 2, position: "relative" }}>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteItem(fieldKey, idx)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>

            <Stack spacing={1}>
              {Object.keys(itemSchema).map((subKey) => {
                const subValue = item[subKey] ?? "";

                // render select para idService con label "Servicio"
                if (subKey === "idService") {
                  return (
                    <TextField
                      key={subKey}
                      select
                      label="Servicio"
                      fullWidth
                      value={subValue}
                      onChange={(e) => handleItemFieldChange(fieldKey, idx, subKey, e.target.value)}
                    >
                      {services.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                          {s.service_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  );
                }

                // campos de texto (primary, secondary u otros)
                return (
                  <TextField
                    key={subKey}
                    label={itemSchema[subKey].label ?? subKey}
                    fullWidth
                    value={subValue}
                    onChange={(e) => handleItemFieldChange(fieldKey, idx, subKey, e.target.value)}
                  />
                );
              })}
            </Stack>
          </Paper>
        ))
      )}
    </Box>
  );
}

return null;


};

return ( <Dialog open={open} onClose={onCancel} maxWidth="md" fullWidth> <DialogTitle>Editar Profesional</DialogTitle>


  <DialogContent dividers>
    <Stack spacing={2}>
      {Object.keys(schema).map((fieldKey) => renderField(fieldKey, schema[fieldKey]))}
    </Stack>
  </DialogContent>

  <DialogActions>
    <Button onClick={onCancel} color="error">Cancelar</Button>
    <Button onClick={onSave} variant="contained">Guardar</Button>
  </DialogActions>
</Dialog>


);
};

export default EditModal;
