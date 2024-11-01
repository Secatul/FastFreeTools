import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../redux/store'; 

interface Tool {
  name: string;
  route: string;
  icon: string;
  description: string;
  categories: string[];
}

interface ToolsState {
  tools: Tool[];
  loading: boolean;
}

const initialState: ToolsState = {
  tools: [], 
  loading: false,
};

const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    setTools: (state, action: PayloadAction<Tool[]>) => {
      console.log("Setting tools in state: ", action.payload);
      state.tools = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const fetchTools = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));  
  try {
    console.log("Fetching tools from API...");
    const response = await fetch(`/api/tools`);
    if (!response.ok) {
      throw new Error('Failed to fetch tools');
    }

    const data = await response.json();
    console.log("Fetched tools data: ", data);
    dispatch(setTools(data));  
  } catch (error) {
    console.error('Error fetching tools:', error);
  } finally {
    dispatch(setLoading(false));  
  }
};

export const { setTools, setLoading } = toolsSlice.actions;
export default toolsSlice.reducer;
