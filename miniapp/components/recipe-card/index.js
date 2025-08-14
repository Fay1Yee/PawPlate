Component({
  properties: {
    item: {
      type: Object,
      value: {},
      observer: function (newVal) {
        if (newVal.ingredients) {
          this.setData({
            ingredientsText: newVal.ingredients.map(i => i.name).join('、')
          });
        }
      }
    }
  },
  data: {
    ingredientsText: ''
  },
  methods: {
    open(e) {
      const id = e.currentTarget.dataset.id;
      tt.navigateTo({ url: `/pages/recipe/index?id=${id}` });
    }
  }
});
