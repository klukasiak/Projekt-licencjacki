import http from "../http-common";

class MessageService {
  getReceived(username) {
    return http.get(`/message/received/${username}`);
  }

  getSended(username) {
    return http.get(`/message/sended/${username}`);
  }

  addMessage(message) {
    return http.post("/messages", message);
  }

  getMy(username) {
    return http.get(`/message/my/${username}`);
  }
}

export default new MessageService();