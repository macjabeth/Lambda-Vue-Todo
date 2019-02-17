Vue.component('task', {
  props: ['todo', 'complete'],
  data: () => ({
    editing: false,
    hovering: false,
    input: ''
  }),
  methods: {
    edit(event) {
      event.stopPropagation();
      this.editing = !this.editing;
      this.input = this.todo.task;
      this.$nextTick(() => this.$refs.input.focus());
    },
    submit(event) {
      event.preventDefault();
      this.$emit('edit-todo', [ this.todo.id, this.input ]);
      this.editing = false;
    },
    enter() { this.hovering = true },
    leave() { this.hovering = false }
  },
  template: `
    <li :class="{completed: todo.completed}" @click="complete(todo.id, editing)" @mouseenter="enter" @mouseleave="leave">
      <div v-if="editing">
        <form @submit="submit">
          <input v-model="input" ref="input">
        </form>
      </div>
      <template v-else>
        <span>{{todo.task}}</span>
      </template>
      <i class="far fa-edit" :class="{display: hovering}" @click="edit" title="Edit"></i>
    </li>
  `
});

const app = new Vue({
  el: '#app',
  data: () => ({
    input: '',
    searching: false,
    todos: [{
      task: 'Bake Cookies',
      id: Date.now(),
      completed: false
    }]
  }),
  methods: {
    submit(event) {
      event.preventDefault()

      this.todos.push({
        task: this.input,
        id: Date.now(),
        completed: false
      });

      this.input = '';
    },

    edit(data) {
      const [id, task] = data;
      this.todos = this.todos.map(todo =>
        todo.id === id
          ? { ...todo, task }
          : todo
      )
    },

    complete(id, editing) {
      if (editing) return;
      this.todos = this.todos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    },

    search() {
      this.searching = !this.searching;
    },

    clear() {
      this.todos = this.todos.filter(todo => !todo.completed);
    }
  }
});
