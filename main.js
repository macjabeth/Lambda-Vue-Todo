Vue.component('task', {
  props: ['todo', 'complete'],
  data: () => ({
    editing: false,
    hovering: false,
    input: ''
  }),
  computed: {
    completedStyle() {
      return { completed: this.todo.completed };
    }
  },
  methods: {
    edit(event) {
      this.editing = !this.editing;
      this.input = this.todo.task;
      this.$nextTick(() => this.$refs.input[0].focus());
    },
    submit() {
      this.$emit('edit', [ this.todo.id, this.input ]);
      this.editing = false;
    },
    enter() { this.hovering = true },
    leave() { this.hovering = false }
  }
});

const app = new Vue({
  el: '#app',
  data: () => ({
    input: '',
    searching: false,
    todos: []
  }),
  computed: {
    placeholder() {
      return this.searching ? 'Filter...' : 'What needs to be done?';
    },
    filter() {
      return (todo) => (this.searching && todo.task.includes(this.input)) || !this.searching;
    },
    searchStyle() {
      return { active: this.searching };
    }
  },
  methods: {
    submit() {
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
  },
  watch: {
    todos: {
      deep: true,
      handler() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
      }
    }
  },
  mounted() {
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
  }
});
