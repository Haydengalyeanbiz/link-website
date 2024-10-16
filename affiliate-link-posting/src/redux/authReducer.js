// ? --------- ACTIONS -----------
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// ? --------- ACTION CREATORS -----------
export const login = (user) => ({
	type: LOGIN,
	payload: user,
});

export const logout = () => ({
	type: LOGOUT,
});

// ! ---------- INITIAL STATE --------------
const initialState = {
	user: null,
};

// ! ---------- AMAZON REDUCER --------------
export const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOGIN:
			return {
				...state,
				user: action.payload,
			};
		case LOGOUT:
			return {
				...state,
				user: null,
			};
		default:
			return state;
	}
};

export default authReducer;
