import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tools: [], 
  loading: false,
};

const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    setTools: (state, action) => {
      state.tools = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const fetchTools = () => async (dispatch) => {
  dispatch(setLoading(true));  
  try {
    const response = await fetch(`/api/tools`);  
    if (!response.ok) {
      throw new Error('Failed to fetch tools');
    }

    const data = await response.json();  
    console.log('Fetched tools:', data); // <-- Verifique se a nova ferramenta está aqui
    dispatch(setTools(data));  
  } catch (error) {
    console.error('Error fetching tools:', error);
  } finally {
    dispatch(setLoading(false));  
  }
};


export const { setTools, setLoading } = toolsSlice.actions;
export default toolsSlice.reducer;
