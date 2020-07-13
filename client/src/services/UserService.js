import http from "../http-common";

class UserService {
  login(data) {
    return http.post("/login", data);
  }

  register(data) {
    return http.post("/register", data);
  }

  logout() {
    return http.get("/logout");
  }

  get() {
    return http.get("/user");
  }

  getById(id) {
    return http.get(`/user/${id}`);
  }
}

export default new UserService();