
Page({
  data:{ speciesRange:['cat','dog'], form:{species:'cat',breed:'',age_months:'',weight_kg:'',allergies:'',taste:''} },
  onSpecies(e){ this.setData({ 'form.species': this.data.speciesRange[e.detail.value] }); },
  onInput(e){ const k=e.currentTarget.dataset.key; this.setData({ ['form.'+k]: e.detail.value }); },
  submit(){
    const query = encodeURIComponent(JSON.stringify(this.data.form));
    const pages=getCurrentPages(); const id=pages[pages.length-1].options.id || 'cat_001';
    tt.navigateTo({ url:`/pages/ai/result/index?id=${id}&form=${query}` });
  }
});
