<template>
  <div class="program">
    <answers-popup
        :questions="program.questions"
        :userId="selectedUserIdForAnswers"/>
    <confirmation-popup
        @cancelClick="showActionConfirmationPopup"
        @confirmationClick="postMenteeConfirmation"
        v-if="isShowMenteeConfirmation"
        text="Mentee olarak kabul etmek üzeresin."/>
    <div class="title">
      {{ program.title }}
    </div>
    <div class="program_info">
      <div class="selected_mentee_count">
        <i class="fas fa-user-check"></i>
        {{ program.approved_mentee_count }} kişi mentee olarak seçildi
      </div>
      <div class="mentee_count">
        <i class="fas fa-users"></i>
        {{ program.mentee_count }} mentee sayısı
      </div>
    </div>
    <div class="program_content">
      <div class="filter">
        <div class="title">
          <i class="fas fa-filter"></i>
          Filtreler
        </div>
        <div class="filter_list">
          <div class="item">
            <standart-checkbox
                text="CV yüklemiş kullanıcılar"
                id="cv_filter"
                v-model="filters.onlyUserCvUploaded"/>
          </div>
          <div class="item">
            <standart-checkbox
                text="Şuan mentee olmayan kullanıcılar"
                id="mentee_filter"
                v-model="filters.onlyIsNotMentee"/>
          </div>
        </div>
      </div>
      <div class="program_appear_list">
        <div
            v-for="(user,index) in program.appealed_users"
            :key="index"
            class="item">
          <div class="user_image">
            <img :src="user.image">
          </div>
          <div class="user_username">
            {{ user.username }}
          </div>
          <div
              v-if="program.has_questions"
              @click="showAnswers(user.id)"
              class="show_answers_btn">
            Cevapları Gör
          </div>
          <div
              v-if="!user.is_mentee_selected"
              @click="menteeConfirmationClick(user.id)"
              class="action_btn accept_mentee_btn">
            Kabul İsteği
          </div>
          <div v-else class="action_btn already_accepted">
            Artık mentee
          </div>
          <router-link
              tag="div"
              :to="{name:'UserProfile',params:{username:user.username}}"
              class="action_btn show_profile_btn">
            Profili Gör
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
  name: "ProgramDetail",
  data() {
    return {
      program: {},
      selectedUserIdForAnswers: '',
      isShowMenteeConfirmation: false,
      postMenteeConfirmationData: {
        user_id: 0
      },
      filters: {
        onlyUserCvUploaded: false,
        onlyIsNotMentee: false
      }
    }
  },
  components: {
    AnswersPopup: () => import('@/components/pages/myMentorPrograms/AnswersPopup'),
    StandartCheckbox: () => import('@/components/pages/shared/elements/StandartCheckbox'),
    ConfirmationPopup: () => import('@/components/pages/shared/ConfirmationPopup'),
  },
  methods: {
    ...mapMutations({
      setShowPopup: 'setShowPopup'
    }),
    getMeMentorProgramDetail() {
      this.$store.dispatch('getMeMentorProgramDetail')
          .then(res => {
            this.program = res;
          })
    },
    showAnswers(userId) {
      this.setShowPopup(true);
      this.selectedUserIdForAnswers = userId;
    },
    getMeMentorProgramUsers() {
      this.$store.dispatch('getMeMentorProgramAppliedUsers', this.filters)
          .then(res => {
            this.program.appealed_users = res;
          });
    },
    showActionConfirmationPopup() {
      this.isShowMenteeConfirmation = !this.isShowMenteeConfirmation;
    },
    menteeConfirmationClick(userId) {
      this.postMenteeConfirmationData.user_id = userId;
      this.showActionConfirmationPopup();
    },
    postMenteeConfirmation() {
      this.showActionConfirmationPopup();
      this.$store.dispatch('postMenteeConfirmation', this.postMenteeConfirmationData)
          .then(() => {
            this.changeSelectedMenteeInAppealedUsers(this.postMenteeConfirmationData.user_id);
            this.increaseSelectedMentee();
          });
    },
    changeSelectedMenteeInAppealedUsers(userId) {
      this.program.appealed_users.find(item => item.id === userId).is_mentee_selected = true;
    },
    increaseSelectedMentee() {
      this.program.approved_mentee_count++;
    }
  },
  watch: {
    filters: {
      handler() {
        this.getMeMentorProgramUsers();
      },
      deep: true
    }
  },
  created() {
    this.getMeMentorProgramDetail();
  }
}
</script>

<style scoped>
.program {
}

.program > .title {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 22px;
  color: var(--navy-blue-text-color);
}

.program_info {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.program_info > div {
  color: var(--navy-red-txt-color);
  background-color: #ffe9e9;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  padding: 5px 12px;
  border: 1px solid #ffdddd;;
  border-radius: 4px;
  margin-left: 15px;
}

.program_content {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.program_content > .filter {
  background-color: white;
  padding: 10px;
  width: 24%;
  border-radius: 5px;
  box-shadow: 0 0px 0.4px rgba(0, 0, 0, 0.014),
  0 0px 1.1px rgba(0, 0, 0, 0.02),
  0 0px 2px rgba(0, 0, 0, 0.025),
  0 0px 3.6px rgba(0, 0, 0, 0.03),
  0 0px 6.7px rgba(0, 0, 0, 0.036),
  0 0px 16px rgba(0, 0, 0, 0.05);

}

.filter > .title {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  color: var(--navy-blue-text-color);
  text-align: center;
}

.filter > .filter_list {
  margin-top: 13px;
  display: flex;
  flex-direction: column;
}

.filter > .filter_list > .item {
  margin: 5px 0;
}


.program_content > .program_appear_list {
  width: 73%;
  background-color: white;
  padding: 20px;
  display: flex;
}

.program_content > .program_appear_list > .item {
  margin: 10px;
  padding: 12px 18px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: .2s;
  box-shadow: 0 0px 0.4px rgba(0, 0, 0, 0.008),
  0 0px 1.1px rgba(0, 0, 0, 0.012),
  0 0px 2px rgba(0, 0, 0, 0.015),
  0 0px 3.6px rgba(0, 0, 0, 0.018),
  0 0px 6.7px rgba(0, 0, 0, 0.022),
  0 0px 16px rgba(0, 0, 0, 0.03);
}

.program_content > .program_appear_list > .item:hover {
  transform: scale(1.02);
}

.program_content > .program_appear_list > .item > .user_image > img {
  width: 100px;
  height: 100px;
  border-radius: var(--navy-user-profile-border-radius);
}

.program_content > .program_appear_list > .item > .user_username {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--navy-blue-text-color);
}

.program_content > .program_appear_list > .item > .show_answers_btn {
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
  font-size: 12px;
  margin-top: 4px;
  cursor: pointer;
}

.program_content > .program_appear_list > .item > .show_answers_btn:hover {
  color: #454545;
  text-decoration: underline;
}

.program_content > .program_appear_list > .item > .action_btn {
  width: 100%;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 12px;
  padding: 4px 6px;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
}

.program_content > .program_appear_list > .item > .accept_mentee_btn {
  color: white;
  background-color: var(--navy-green-color);
  margin-top: 5px;
}

.program_content > .program_appear_list > .item > .show_profile_btn {
  text-align: center;
  margin-top: 5px;
  background-color: #d7d7d7;
  color: black;
}

.program_content > .program_appear_list > .item > .already_accepted {
  font-style: italic;
  color: var(--navy-green-color);
}
</style>