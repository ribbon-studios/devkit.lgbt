import { RouteID } from '@/routes';
import { Storage, StorageKeys } from '@/storage';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LoadingKey, LoadingStatus, setLoadingStatus } from './loading.slice';
import { RootState } from './state';

export type SettingsState = {
  routes: RouteID[];
};

export const INITIAL_STATE: SettingsState = {
  routes: [RouteID.NOTES, RouteID.TODO, RouteID.HASHING, RouteID.DATA, RouteID.SETTINGS],
};

export const loadSettings = createAsyncThunk.withTypes<{
  state: RootState;
}>()('settings/load', async (_: never, { dispatch }) => {
  dispatch(setLoadingStatus([LoadingKey.SETTINGS, LoadingStatus.IN_PROGRESS]));

  try {
    const settings = await Storage.get(StorageKeys.SETTINGS, 'settings');

    dispatch(setState(settings));

    dispatch(setLoadingStatus([LoadingKey.SETTINGS, LoadingStatus.COMPLETED]));
  } catch (e) {
    dispatch(setLoadingStatus([LoadingKey.SETTINGS, LoadingStatus.ERROR]));
  }
});

export const toggleRoute = createAsyncThunk.withTypes<{
  state: RootState;
}>()('settings/update', async (key: RouteID, { dispatch, getState }) => {
  dispatch(toggleRouteInternal(key));

  const settings = selectSettings(getState());
  await Storage.set(StorageKeys.SETTINGS, {
    ...settings,
    id: 'settings',
  });
});

export const slice = createSlice({
  name: 'settings',
  initialState: INITIAL_STATE,
  reducers: {
    setState(_, action: PayloadAction<SettingsState>) {
      return action.payload;
    },
    toggleRouteInternal(state, action: PayloadAction<RouteID>) {
      if (action.payload === RouteID.SETTINGS) return;

      const index = state.routes.indexOf(action.payload);

      if (index === -1) {
        state.routes.push(action.payload);
      } else {
        state.routes.splice(index, 1);
      }
    },
  },
});

// Private Actions
const { setState, toggleRouteInternal } = slice.actions;

export const selectSettings = (state: RootState) => state.settings;
export const selectSettingsRoutes = (state: RootState) => selectSettings(state).routes;

export default slice.reducer;
