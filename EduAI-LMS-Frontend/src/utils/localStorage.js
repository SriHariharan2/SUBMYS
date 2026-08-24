const TOKEN_KEY = "jwtToken";
const USER_KEY = "user";

// ================= TOKEN =================

export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

// ================= USER =================

export const saveUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const getUserId = () => {
    const user = getUser();
    return user ? user.id : null;
};

export const removeUser = () => {
    localStorage.removeItem(USER_KEY);
};

// ================= ROLE =================

export const getRole = () => {
    const user = getUser();

    if (!user) return null;

    // If backend returns:
    // { role: "ADMIN" }
    if (user.role) return user.role;

    // If backend returns:
    // { roles: ["ADMIN"] }
    if (Array.isArray(user.roles) && user.roles.length > 0) {
        return user.roles[0];
    }

    // If backend returns:
    // { authorities: ["ROLE_ADMIN"] }
    if (Array.isArray(user.authorities) && user.authorities.length > 0) {
        return user.authorities[0].replace("ROLE_", "");
    }

    return null;
};




// ================= LOGOUT =================

export const logout = () => {
    removeToken();
    removeUser();
};