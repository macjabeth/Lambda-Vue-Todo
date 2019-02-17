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
      this.$nextTick(() => this.$refs.input[0].focus());
    },
    submit(event) {
      event.preventDefault();
      this.$emit('edit-todo', [ this.todo.id, this.input ]);
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
