import { timeout } from '@/lib/promise';
import { RouteID } from '@/routes';
import { Storage, StorageKeys } from '@/storage';
import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { LoadingKey, LoadingStatus, setLoadingStatus } from './loading.slice';
import { RootState } from './state';

export type SettingsState = {
  routes: RouteID[];
  developer: {
    enabled: boolean;
    skeletons: boolean;
    skeletonHideContent: boolean;
  };
};

export const INITIAL_STATE: SettingsState = {
  routes: [RouteID.NOTES, RouteID.TODO, RouteID.HASHING, RouteID.DATA, RouteID.SETTINGS],
  developer: {
    enabled: false,
    skeletons: false,
    skeletonHideContent: false,
  },
};

export const loadSettings = createAsyncThunk.withTypes<{
  state: RootState;
}>()('settings/load', async (_: never, { dispatch }) => {
  dispatch(setLoadingStatus([LoadingKey.SETTINGS, LoadingStatus.IN_PROGRESS]));

  try {
    const settings = await Storage.get(StorageKeys.SETTINGS, 'settings');

    await timeout(500);

    dispatch(setState(settings));

    dispatch(setLoadingStatus([LoadingKey.SETTINGS, LoadingStatus.COMPLETED]));
  } catch (e) {
    dispatch(setLoadingStatus([LoadingKey.SETTINGS, LoadingStatus.ERROR]));
  }
});

export const setDeveloperSetting = createAsyncThunk.withTypes<{
  state: RootState;
}>()(
  'settings/update/developer',
  async ([key, value]: [keyof SettingsState['developer'], boolean], { dispatch, getState }) => {
    dispatch(setDeveloperSettingInternal([key, value]));

    const { settings } = getState();
    await Storage.set(StorageKeys.SETTINGS, {
      ...settings,
      id: 'settings',
    });
  }
);

export const toggleRoute = createAsyncThunk.withTypes<{
  state: RootState;
}>()('settings/update/routes', async (key: RouteID, { dispatch, getState }) => {
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
    setState(state, action: PayloadAction<SettingsState>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setDeveloperSettingInternal(state, action: PayloadAction<[keyof SettingsState['developer'], boolean]>) {
      const [key, value] = action.payload;

      state.developer[key] = value;
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
const { setState, setDeveloperSettingInternal, toggleRouteInternal } = slice.actions;

export const selectSettings = createSelector([(state: RootState) => state.settings], (settings) => ({
  ...settings,
  developer: settings.developer.enabled
    ? {
        ...settings.developer,
        skeletonHideContent: settings.developer.skeletons ? settings.developer.skeletonHideContent : false,
      }
    : {
        enabled: false,
        skeletons: false,
        skeletonHideContent: false,
      },
}));
export const selectSettingsRoutes = (state: RootState) => selectSettings(state).routes;
export const selectDeveloper = (state: RootState) => {
  return selectSettings(state).developer;
};
export const selectDeveloperSetting = (key: keyof SettingsState['developer']) => (state: RootState) => {
  return selectDeveloper(state)[key];
};

export default slice.reducer;
