import axios from "axios";

export const mentorProgram = {
    state: {
        programs: []
    },
    mutations: {
        setMentorPrograms(state, payload) {
            state.programs = payload;
        },
        setMoreMentorPrograms(state, payload) {
            payload.map(value => {
                state.programs.push(value);
            });
        }
    },
    actions: {
        getMentorPrograms({commit}, payload) {
            return axios.get('/mentor-programs', {
                params: {...payload}
            })
                .then(res => {
                    commit('setMentorPrograms', res.data.data);
                })
        },
        getMoreMentorPrograms({commit, getters}, payload) {
            payload.lastProgramDeadline = getters.getLastProgramDeadline;
            return axios.get('/mentor-programs', {
                params: {...payload}
            })
                .then(res => {
                    commit('setMoreMentorPrograms', res.data.data);
                    return res.data.data.length === 0;
                })
        },
        // state eklenecek mi?
        postMentorProgram(_, payload) {
            axios.post('mentor-programs', payload)
                .then(res => {
                    console.log(res);
                });
        }
    },
    getters: {
        getLastProgramDeadline(state) {
            return state.programs.length !== 0 ? state.programs[state.programs.length - 1].deadline : 'now';
        }
    }
}
