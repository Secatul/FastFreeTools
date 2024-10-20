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
  dispatch(setLoading(true));  // Inicia o carregamento
  try {
    const response = await fetch(`/api/tools`);  // A API agora retorna todas as ferramentas de uma vez
    if (!response.ok) {
      throw new Error('Failed to fetch tools');
    }

    const data = await response.json();  // Recebe os dados das ferramentas
    dispatch(setTools(data));  // Atualiza todas as ferramentas no estado global
  } catch (error) {
    console.error('Error fetching tools:', error);
  } finally {
    dispatch(setLoading(false));  // Finaliza o estado de carregamento
  }
};

export const { setTools, setLoading } = toolsSlice.actions;
export default toolsSlice.reducer;
