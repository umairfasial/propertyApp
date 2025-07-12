import {configureStore} from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/auth/authSlice';
import propertyReducer from './slices/property/propertySlice';
import issueReducer from './slices/issue/issueSlice';
import inspectionReducer from './slices/inspection/inspectionSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    property: propertyReducer,
    issue: issueReducer,
    inspection: inspectionReducer,
  },
});

export default store;
