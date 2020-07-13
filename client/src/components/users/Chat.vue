<template>
  <div id="container">
    <div id="contacts">
      <ul>
        <li v-for="(u, index) in users" :key="index">
          <a @click="messagesWith(u)">{{ u }}</a>
        </li>
      </ul>New user:
      <input name="nickname" id="nickname" />
      <button @click="newUser()">Add</button>
    </div>
    <div id="chat">
      <ul>
        <li v-for="(message, index) in actualmessages" :key="index">
          <div>{{ message.sender }}: {{ message.text }}</div>
          <p id="date">{{ dateString(message.date) }}</p>
        </li>
      </ul>
      <input name="newMessage" id="newMessage" />
      <button @click="sendMessage()">Send</button>
    </div>
  </div>
</template>

<script>
import MessageService from "../../services/MessageService";
import UserService from "../../services/UserService";
// import socketio from "socket.io-client";
//import router from "../../router";

export default {
  name: "chat",
  data() {
    return {
      user: {},
      users: [],
      messages: [],
      actualmessages: [],
      currentUser: "",
      socket: null
    };
  },
  sockets: {
    msg: function(data) {
      console.log(data);
      console.log("sended");
      this.messages.push(data);
      this.messages = this.messages.reduce(
        (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
        []
      );
      if (this.currentUser == "") {
        this.currentUser = data.sender;
      }
      this.messagesWith(this.currentUser);
    }
  },
  methods: {
    retreiveUser() {
      UserService.get()
        .then(response => {
          this.user = response.data.user;
          MessageService.getMy(response.data.user.username)
            .then(response => {
              console.log(response);
              this.messages = response.data;
              let userSenders = this.messages.map(m => m.sender);
              let userRecipients = this.messages.map(m => m.recipient);
              let result = userSenders.concat(userRecipients);
              result = result.reduce(
                (unique, item) =>
                  unique.includes(item) ? unique : [...unique, item],
                []
              );
              result = result.filter(item => item != this.user.username);
              this.users = result;
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    },
    messagesWith(user) {
      let sended = this.messages.filter(mess => mess.sender == user);
      let reciv = this.messages.filter(mess => mess.recipient == user);
      let mess = sended.concat(reciv);
      this.actualmessages = mess.sort((a, b) => (a.date > b.date ? 1 : -1));
      this.actualmessages = this.actualmessages.slice(
        Math.max(this.actualmessages.length - 6, 0)
      );
      this.currentUser = user;
      this.socket.emit("privateChat", {
        sender: this.user.username,
        recipient: this.currentUser
      });
    },
    sendMessage() {
      let text = document.getElementById("newMessage").value;
      this.socket.emit("newMessage", {
        sender: this.user.username,
        recipient: this.currentUser,
        text: text
      });
    },
    newUser() {
      let nick = document.getElementById("nickname").value;
      this.users.push(nick);
    },
    dateString(date) {
      return new Date(date).toLocaleString();
    }
  },
  mounted() {
    this.retreiveUser();
    this.socket = this.$socket.client;
    console.log(this.socket);
    this.socket.on("msg", data => {
      console.log(data);
      console.log("sended");
      this.messages.push(data);
      this.messages = this.messages.reduce(
        (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
        []
      );

      if (this.currentUser == "") {
        this.currentUser = data.sender;
      }
      this.messagesWith(this.currentUser);
    });
  },
  destroyed() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/chat.scss";
</style>