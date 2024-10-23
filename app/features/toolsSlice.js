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
      console.log("Setting tools in state: ", action.payload);  // Verificando os dados que estão sendo setados
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
    console.log("Fetching tools from API..."); // Adicionando log
    const response = await fetch(`/api/tools`);  
    if (!response.ok) {
      throw new Error('Failed to fetch tools');
    }

    const data = await response.json();
    console.log("Fetched tools data: ", data); // Adicionando log
    dispatch(setTools(data));  
  } catch (error) {
    console.error('Error fetching tools:', error);
  } finally {
    dispatch(setLoading(false));  
  }
};


export const { setTools, setLoading } = toolsSlice.actions;
export default toolsSlice.reducer;
