import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './state';

export enum LoadingKey {
  SETTINGS,
  ANY_LOADING,
}

export enum LoadingStatus {
  NOT_STARTED,
  IN_PROGRESS,
  ERROR,
  COMPLETED,
}

export type LoadingState = {
  [key in Exclude<LoadingKey, LoadingKey.ANY_LOADING>]?: LoadingStatus;
} & {
  [LoadingKey.ANY_LOADING]: number;
};

const INITIAL_STATE: LoadingState = {
  [LoadingKey.SETTINGS]: LoadingStatus.IN_PROGRESS,
  [LoadingKey.ANY_LOADING]: 1,
};

export const slice = createSlice({
  name: 'settings',
  initialState: INITIAL_STATE,
  reducers: {
    setLoadingStatus(state, action: PayloadAction<[LoadingKey, LoadingStatus]>) {
      const [key, status] = action.payload;

      // Skip if no change has occurred.
      if (state[key] === status) return;

      if (state[key] === LoadingStatus.IN_PROGRESS) {
        state[LoadingKey.ANY_LOADING] -= 1;
      } else if (status === LoadingStatus.IN_PROGRESS) {
        state[LoadingKey.ANY_LOADING] += 1;
      }

      state[key] = status;
    },
  },
});

export const selectLoadingStatuses = (state: RootState): LoadingState => state.loading;
export const selectLoadingStatus =
  <K extends LoadingKey>(key: K, defaultStatus: LoadingStatus = LoadingStatus.NOT_STARTED) =>
  (state: RootState): LoadingState[K] => {
    const status = selectLoadingStatuses(state)[key];
    if (typeof status === 'number') {
      return status;
    }

    return status ?? defaultStatus;
  };

const isStatus =
  (key: LoadingKey, expectedStatus: LoadingStatus, defaultStatus?: LoadingStatus) =>
  (state: RootState): boolean =>
    selectLoadingStatus(key, defaultStatus)(state) === expectedStatus;

export const isLoading = (key: LoadingKey) => isStatus(key, LoadingStatus.IN_PROGRESS);
export const isNotLoading = (key: LoadingKey) => !isLoading(key);

export const areAnyLoading = (state: RootState) => selectLoadingStatus(LoadingKey.ANY_LOADING)(state) > 0;

export const { setLoadingStatus } = slice.actions;
export default slice.reducer;

// export const LoadingThunk = async <Returned, ThunkArg = void>(
//   key: LoadingKey,
//   fn: AsyncThunkPayloadCreator<Returned, ThunkArg>
// ): AsyncThunkPayloadCreator<Returned, ThunkArg> => {
//   const wrapper: AsyncThunkPayloadCreator<Returned, ThunkArg> = async (arg, thunkApi) => {
//     thunkApi.dispatch(setLoadingStatus([key, LoadingStatus.IN_PROGRESS]));

//     try {
//       const response = await fn(arg, thunkApi);

//       thunkApi.dispatch(setLoadingStatus([key, LoadingStatus.COMPLETED]));

//       return response;
//     } catch (e) {
//       thunkApi.dispatch(setLoadingStatus([key, LoadingStatus.ERROR]));
//     }
//   };

//   return wrapper;
// };
