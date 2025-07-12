import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  addPropertyApi,
  fetchPropertiesApi,
  addCertificateApi,
  fetchCertificatesApi,
  addPropertyManagerApi,
  addPropertyTenantApi,
  addContractApi,
  editContractApi,
  fetchContractsApi,
  deletePropertyApi,
  editPropertyApi,
  editCertificateApi,
  downloadFileApi,
  fetchPropertyByPropertyIdApi,
  fetchPropertiesByPropertiesIdApi,
} from './propertyApi';
import {downloadFile} from 'react-native-fs';

const initialState = {
  properties: [],
  selectedProperty: [],
  certificates: [],
  contracts: [],
  loading: false,
  error: null,
  currentProperty: null,
  downloading: false,
};

export const addPropertySlice = createAsyncThunk(
  'property/addProperty',
  async ({finalData}, {dispatch}) => {
    try {
      const response = await addPropertyApi({
        finalData,
        dispatch,
      });

      return response;
    } catch (error) {
      console.error('Error in addPropertySlice:', error);
      throw error;
    }
  },
);

export const editPropertySlice = createAsyncThunk(
  'property/editPropertySlice',
  async ({finalData, propertyId}, {dispatch}) => {
    try {
      const response = await editPropertyApi({
        finalData,
        propertyId,
        dispatch,
      });

      return response;
    } catch (error) {
      console.error('Error in addPropertySlice:', error);
      throw error;
    }
  },
);

// Async thunk for fetching user properties
export const fetchPropertiesSlice = createAsyncThunk(
  'property/fetchProperties',
  async ({userId}, {dispatch}) => {
    try {
      const response = await fetchPropertiesApi({userId});
      return response;
    } catch (error) {
      console.error('Error in fetchPropertiesSlice:', error);
      throw error;
    }
  },
);

// Add Certificate
export const addCertificateSlice = createAsyncThunk(
  'property/addCertificate',
  async (certificateData, {rejectWithValue}) => {
    try {
      const response = await addCertificateApi(certificateData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const editCertificateSlice = createAsyncThunk(
  'property/editCertificateSlice',
  async ({certificateData, certificateId}, {rejectWithValue}) => {
    try {
      const response = await editCertificateApi({
        certificateData,
        certificateId,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addContractSlice = createAsyncThunk(
  'property/addContractSlice',
  async (contractData, {rejectWithValue}) => {
    try {
      const response = await addContractApi(contractData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const editContractSlice = createAsyncThunk(
  'property/editContractSlice',
  async ({contractData, contractId}, {rejectWithValue}) => {
    try {
      const response = await editContractApi({contractData, contractId});
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Fetch Certificates
export const fetchCertificatesSlice = createAsyncThunk(
  'property/fetchCertificates',
  async ({userId, propertyId}, {rejectWithValue}) => {
    try {
      const response = await fetchCertificatesApi({userId});
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchContractsWithId = createAsyncThunk(
  'property/fetchContractsWithId',
  async ({id}, {rejectWithValue}) => {
    try {
      const response = await fetchContractsApi({id});
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addPropertyManager = createAsyncThunk(
  'property/addPropertyManager',
  async ({managerId, propertyId}, {rejectWithValue}) => {
    try {
      const response = await addPropertyManagerApi({managerId, propertyId});
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addPropertyTenant = createAsyncThunk(
  'property/addPropertyTenant',
  async ({tenantId, propertyId}, {rejectWithValue}) => {
    try {
      const response = await addPropertyTenantApi({tenantId, propertyId});
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deletePropertySlice = createAsyncThunk(
  'property/deleteProperty',
  async ({propertyId}, {rejectWithValue}) => {
    try {
      const response = await deletePropertyApi({propertyId});
      return response;
    } catch (error) {
      rejectWithValue(error.message);
    }
  },
);

export const downloadFileSlice = createAsyncThunk(
  'property/downloadFile',
  async (url, {rejectWithValue}) => {
    try {
      const response = await downloadFileApi(url);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchPropertyByPropertyIdSlice = createAsyncThunk(
  'property/fetchPropertyByPropertyIdSlice',
  async ({propertyId}, {rejectWithValue}) => {
    try {
      const response = await fetchPropertyByPropertyIdApi({propertyId});
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
export const fetchPropertiesByPropertiesIdSlice = createAsyncThunk(
  'property/fetchPropertiesByPropertiesIdSlice',
  async ({properties}, {rejectWithValue}) => {
    try {
      const response = await fetchPropertiesByPropertiesIdApi({properties});
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setCurrentProperty: (state, {payload}) => {
      state.currentProperty = payload;
    },
    clearPropertyError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Add Property
      .addCase(addPropertySlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPropertySlice.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.properties = [...state.properties, payload];
      })
      .addCase(addPropertySlice.rejected, (state, {error}) => {
        state.loading = false;
        state.error = error.message;
      })
      // Fetch Properties
      .addCase(fetchPropertiesSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertiesSlice.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.properties = payload;
      })
      .addCase(fetchPropertiesSlice.rejected, (state, {error}) => {
        state.loading = false;
        state.error = error.message;
      })
      // Add Certificate
      .addCase(addCertificateSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCertificateSlice.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.certificates.push(payload);
      })
      .addCase(addCertificateSlice.rejected, (state, {error}) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(editCertificateSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCertificateSlice.fulfilled, (state, {payload}) => {
        state.loading = false;
      })
      .addCase(editCertificateSlice.rejected, (state, {error}) => {
        state.loading = false;
        state.error = error.message;
      })
      // Fetch Certificates
      .addCase(fetchCertificatesSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificatesSlice.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.certificates = payload;
      })
      .addCase(fetchCertificatesSlice.rejected, (state, {error}) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(fetchContractsWithId.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractsWithId.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.contracts = payload;
      })
      .addCase(fetchContractsWithId.rejected, (state, {error}) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(addContractSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addContractSlice.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.contracts.push(payload);
      })
      .addCase(addContractSlice.rejected, (state, {error}) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(editContractSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editContractSlice.fulfilled, (state, {payload}) => {
        state.loading = false;
        const index = state.contracts.findIndex(
          contract => contract.id === payload.id,
        );
        if (index !== -1) {
          state.contracts[index] = payload;
        }
      })
      .addCase(editContractSlice.rejected, (state, {error}) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(downloadFileSlice.pending, state => {
        state.downloading = true;
        state.error = null;
      })
      .addCase(downloadFileSlice.fulfilled, (state, {payload}) => {
        state.downloading = false;
      })
      .addCase(downloadFileSlice.rejected, (state, {error}) => {
        state.downloading = false;
        state.error = error.message;
      })
      .addCase(fetchPropertyByPropertyIdSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyByPropertyIdSlice.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.selectedProperty = payload;
      })
      .addCase(fetchPropertyByPropertyIdSlice.rejected, (state, {error}) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(fetchPropertiesByPropertiesIdSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPropertiesByPropertiesIdSlice.fulfilled,
        (state, {payload}) => {
          state.loading = false;
          state.selectedProperty = payload;
        },
      )
      .addCase(
        fetchPropertiesByPropertiesIdSlice.rejected,
        (state, {error}) => {
          state.loading = false;
          state.error = error.message;
        },
      );
  },
});

export const {setCurrentProperty, clearPropertyError} = propertySlice.actions;
export default propertySlice.reducer;
