// components/modals/TenantModal.jsx
import React from 'react';
import {
    Modal,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from '@mui/material';
import {storageTenantId} from '../redux/slices/tenantsSlice';
import { useDispatch } from 'react-redux';

const TenantModal = ({ open, tenants, onSelectTenant }) => {
    const [localTenantId, setLocalTenantId] = React.useState('');
    const dispatch = useDispatch();
    console.log(tenants);
    console.log('selectedtenant',localTenantId);
    
    

    const handleChange = (event) => {
        const tenantId = event.target.value;
        setLocalTenantId(tenantId);
        console.log('tenant seleccionado',localTenantId);
        
        dispatch(storageTenantId({ tenantId })); // Usá "tenantId" (minúscula) como en el slice
        onSelectTenant(tenantId);
    };

    React.useEffect(() => {
        if (open) {
            setLocalTenantId('');
        }
    }, [open]);

    return (
        <Modal open={open}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Seleccioná tu Tenant
                </Typography>

                <FormControl fullWidth>
                    <InputLabel id="tenant-select-label">Tenant</InputLabel>
                    <Select
                        labelId="tenant-select-label"
                        value={localTenantId}
                        label="Tenant"
                        onChange={handleChange}
                    >
                        {tenants.map((tenant) => (
                            <MenuItem key={tenant.tenantId} value={tenant.tenantId}>
                                {tenant.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Modal>
    );
};
export default TenantModal;
