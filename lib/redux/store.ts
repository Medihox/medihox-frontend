import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { setupListeners } from '@reduxjs/toolkit/query';

import authReducer from './slices/authSlice';
import { authApi } from './services/authApi';
import { appointmentApi } from './services/appointmentApi';
import { patientApi } from './services/patientApi';
import { userApi } from './services/userApi';
import { customizationApi } from './services/customizationApi';
import { dashboardApi } from './services/dashboardApi';
import { superAdminApi } from './services/superAdminApi';
import { formInquiryApi } from './services/formInquiryApi';

// Create a custom storage object that checks for browser environment
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

// Use localStorage in browser, otherwise use the noop storage
const storage = typeof window !== 'undefined' 
  ? require('redux-persist/lib/storage').default 
  : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only auth will be persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [appointmentApi.reducerPath]: appointmentApi.reducer,
  [patientApi.reducerPath]: patientApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [customizationApi.reducerPath]: customizationApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [superAdminApi.reducerPath]: superAdminApi.reducer,
  [formInquiryApi.reducerPath]: formInquiryApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware, 
      appointmentApi.middleware, 
      patientApi.middleware, 
      userApi.middleware,
      customizationApi.middleware,
      dashboardApi.middleware,
      superAdminApi.middleware,
      formInquiryApi.middleware
    ),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 