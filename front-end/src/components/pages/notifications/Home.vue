<template>
  <bg-white-template>
    <template slot="content">
      <template v-if="notifications.length > 0">
        <div class="notifications_actions">
          <div @click="destroyNotifications" class="all_delete-btn">
            <i class="fas fa-trash-alt"></i>
            Tümünü Sil
          </div>
        </div>
        <div class="notifications_list">
          <div
              v-for="(notification,index) in notifications"
              :key="index"
              class="item">
            <div class="date">
              <i class="far fa-clock"></i>
              {{ moment(notification.created_at).fromNow() }}
            </div>
            <component
                :data="notification.data"
                :is="notificationType(notification.type)"/>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="no_data">
          <i class="far fa-frown"></i>
          Hiç bildirim yok
        </div>
      </template>
    </template>
  </bg-white-template>
</template>

<script>
import Echo from 'laravel-echo'

window.io = require('socket.io-client');

window.Echo = new Echo({
  broadcaster: 'socket.io',
  host: 'http://127.0.0.1:6001',
  authEndpoint: '/broadcasting/auth',
  auth: {
    headers: {
      'Authorization': 'Bearer 67|opivFX92YmCpN8BBYx9zXwg7kWs4ytKSurbIHHns',
      'X-CSRF-Token': "CSRF_TOKEN"
    }
  }
});

// "keyPrefix": "app_database_"

window.Echo.private('fimen_database_deneme')
    .listen('.listen-deneme', (notification) => {
      alert();
      console.log(notification);
    });

export default {
  name: "Home",
  data() {
    return {
      notifications: []
    }
  },
  components: {
    BgWhiteTemplate: () => import('@/components/pages/shared/BgWhiteTemplate'),
    MenteeConfirmation: () => import('@/components/pages/notifications/type/MenteeConfirmationNotification'),
    DestroyMentorMenteeProgram: () => import('@/components/pages/notifications/type/DestroyMentorMenteeProgramNotification'),
  },
  methods: {
    getNotifications() {
      this.$store.dispatch('getNotifications')
          .then(res => {
            this.notifications = res.data.data;
          })
    },
    destroyNotifications() {
      this.$store.dispatch('destroyNotifications')
          .then(() => {
            this.notifications = [];
          });
    },
    notificationType(type) {
      return type.split("\\")[2];
    }
  },
  created() {
    this.getNotifications();
  },
  computed: {}
}
</script>

<style scoped>

.notifications_actions {
  display: flex;
  justify-content: flex-end;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 10px;
}

.notifications_actions > div {
  padding: 4px 12px;
  cursor: pointer;
  border-radius: 20px;
}

.notifications_actions > .all_delete-btn {
  color: var(--navy-red-text-color);
  background-color: #ffeeee;
}

.notifications_actions > .all_delete-btn:hover {
  background-color: #ffe6e6;
}

.no_data {
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
}

.notifications_list {
  margin-top: 20px;
}

.notifications_list > .item {
  margin: 15px 0;
  position: relative;
  width: 100%;
  background-color: #ffffff;
  padding: 14px;
  border-radius: 5px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 0px 0.3px rgba(0, 0, 0, 0.014),
  0 0px 0.8px rgba(0, 0, 0, 0.02),
  0 0px 1.5px rgba(0, 0, 0, 0.025),
  0 0px 2.7px rgba(0, 0, 0, 0.03),
  0 0px 5px rgba(0, 0, 0, 0.036),
  0 0px 12px rgba(0, 0, 0, 0.05);
}

.notifications_list > .item > .date {
  position: absolute;
  right: 5px;
  top: 5px;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 13px;
  color: var(--navy-blue-text-color);
}
</style>